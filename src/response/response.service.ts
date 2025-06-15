import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from './schemas/response.schema';
import { ResponseStatus } from 'src/enums/response_status.enum';
import { Form, FormDocument } from 'src/forms/schemas/forms.schema';
import { CreateResponseDto } from './dto/create_response.dto';
import { UpdateResponseDto } from './dto/update_response.dto';
import { response } from 'express';
import { createClient } from 'redis';


@Injectable()
export class ResponseService {
    constructor(
        @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
        @InjectModel(Form.name) private formModel: Model<FormDocument>,
    ) { }

    async create(createResponseDto: CreateResponseDto): Promise<any> {
        Logger.log(`Creating response for formId: ${createResponseDto.form_id} and respondentId: ${createResponseDto.respondent_id}`);
        let finalResponse;
        const [form, existingResponse] = await Promise.all([
            this.findFormById(createResponseDto.form_id),
            this.findByFormIdAndRespondentId(createResponseDto.form_id, createResponseDto.respondent_id)
        ]);

        if (!form) {
            Logger.warn(`Form with id ${createResponseDto.form_id} does not exist`);
            throw new ConflictException(`Form with id ${createResponseDto.form_id} does not exist`);
        }
        if (existingResponse && existingResponse.status === ResponseStatus.COMPLETED) {
            Logger.warn(`Response already exists for formId ${createResponseDto.form_id} and respondentId ${createResponseDto.respondent_id}`);
            return { response_status: ResponseStatus.COMPLETED, message: 'All questions answered' };
        }

        try {
            if (existingResponse === null) {
                Logger.log(`Creating new response for formId ${createResponseDto.form_id} and respondentId ${createResponseDto.respondent_id}`);

                const newResponse = { ...createResponseDto, response: [], status: ResponseStatus.IN_PROGRESS };
                const createdResponse = new this.responseModel(newResponse);

                finalResponse = (await createdResponse.save());
            } else if (existingResponse.status === ResponseStatus.FAILED) {
                Logger.log(`Resetting response for formId ${createResponseDto.form_id} and respondentId ${createResponseDto.respondent_id}`);

                finalResponse = await this.responseModel.findByIdAndUpdate(
                    existingResponse._id,
                    { status: ResponseStatus.IN_PROGRESS, response: [] },
                    { new: true }
                );
            } else if (existingResponse.status === ResponseStatus.IN_PROGRESS) {
                Logger.log(`Continuing existing response for formId ${createResponseDto.form_id} and respondentId ${createResponseDto.respondent_id}`);
                finalResponse = existingResponse;
            }


        } catch (error) {
            Logger.error('Error creating response:', error);
            throw new Error('Error creating response');
        }

        const responseLength = finalResponse.response.length;
        const question = form.questions[responseLength];

        if (!question) {
            throw new Error('No more questions available');
        }

        return { question, response_id: finalResponse._id, response_status: finalResponse.status };
    }

    async findByFormIdAndRespondentId(formId: string, respondentId: string): Promise<Response | null> {
        try {
            return this.responseModel.findOne({ form_id: formId, respondent_id: respondentId }).exec();
        } catch (error) {
            Logger.error(`Error fetching response for formId ${formId} and respondentId ${respondentId}:`, error);
            throw new Error(`Error fetching response for formId ${formId} and respondentId ${respondentId}`);
        }
    }

    async findFormById(_id: string) {
        const redisClient = createClient({
            url: process.env.REDIS_URI,
        });

        await redisClient.connect();

        const cacheKey = `form:${_id}`;
        let form
        form = await redisClient.get(cacheKey);

        if (form) {
            await redisClient.quit(); // optional, clean up
            Logger.log('Form found in cache')
            return JSON.parse(form);
        }
        Logger.log('Form NOT found in cache')
        form = await this.formModel.findById(_id).exec();

        if (form) {
            const formObj = form.toObject ? form.toObject() : form;
            Logger.log('Adding form to cache')
            await redisClient.set(cacheKey, JSON.stringify(formObj), {
                EX: 3600, // TTL in seconds
            });
            await redisClient.quit(); //  clean up
            return formObj;
        }

        await redisClient.quit(); //  clean up
        return form;
    }

    async update(updateResponseDto: UpdateResponseDto): Promise<any> {
        let response, form;
        try {
            response = await this.responseModel.findById(updateResponseDto.response_id).exec();
            form = await this.findFormById(response.form_id);
        } catch (error) {
            Logger.error(`Error fetching form or response:`, error);
            throw new Error(`Error fetching form or response`);
        }

        if (!response) {
            Logger.warn(`Response with id ${updateResponseDto.response_id} does not exist`);
            throw new Error(`Response with id ${updateResponseDto.response_id} does not exist`);
        }
        if (!form) {
            Logger.warn(`Form with id ${response.form_id} does not exist`);
            throw new Error(`Form with id ${response.form_id} does not exist`);
        }

        if (response.status === ResponseStatus.COMPLETED) {
            Logger.warn(`Response with id ${updateResponseDto.response_id} is already completed`);
            return { response_status: ResponseStatus.COMPLETED, message: 'All questions already answered' };
        }

        try {
            response = await this.responseModel.findByIdAndUpdate(updateResponseDto.response_id, { $push: { response: { question_no: updateResponseDto.question_no, response: updateResponseDto.response } } }, { new: true }).exec();
        } catch (error) {
            Logger.error(`Error updating response with id ${updateResponseDto.response_id}:`, error);
            throw new Error(`Error updating response with id ${updateResponseDto.response_id}`);
        }

        if (!response) {
            Logger.warn(`Response with id ${updateResponseDto.response_id} not found`);
            throw new Error(`Response with id ${updateResponseDto.response_id} not found`);
        }

        const responseLength = response.response.length;
        if (responseLength < form.questions.length) {
            const question = form.questions[responseLength];

            Logger.log(`Returning next question for response with id ${updateResponseDto.response_id}: Question ${question.question_no}`);
            return { question, response_status: response.status };

        } else {
            Logger.log(`All questions answered for response with id ${updateResponseDto.response_id}`);

            await Promise.all([
                this.formModel.findByIdAndUpdate(form._id, { $inc: { total_responses: 1 } }).exec(),
                this.responseModel.findByIdAndUpdate(updateResponseDto.response_id, { status: ResponseStatus.COMPLETED }).exec()
            ]);

            return { response_status: ResponseStatus.COMPLETED, message: 'All questions answered' };
        }
    }

    async findResponseByFormId(formId: string): Promise<any> {
        try {
            let questionMap = {};
            let graphData: { noOfResponse: number[], date: string[] } = {
                noOfResponse: [],
                date: []
            }
            const [responses, form] = await Promise.all([
                this.responseModel.find({ form_id: formId }).sort({ created_at: -1 }).exec(),
                this.formModel.findById(formId).exec()
            ]);
            if (form?.questions?.length) {

                form.questions.forEach(q => {
                    questionMap[q.question_no] = q.question;
                });
            }
            responses.forEach(resp => {
                const date = new Date(resp.get('created_at')).toISOString().split('T')[0];
                const idx = graphData.date.indexOf(date);
                if (idx === -1) {
                    graphData.date.push(date);
                    graphData.noOfResponse.push(1);
                } else {
                    graphData.noOfResponse[idx]++;
                }
            });
            return { form, responses, questionMap, graphData };
        } catch (error) {
            Logger.error(`Error fetching responses for formId ${formId}:`, error);
            throw new Error(`Error fetching responses for formId ${formId}`);
        }
    }
}