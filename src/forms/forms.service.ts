import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form, FormDocument } from './forms.schema';
import { ResponseDocument } from 'src/response/response.schema';

@Injectable()
export class FormsService {
    constructor(
        @InjectModel(Form.name) private formModel: Model<FormDocument>,
    ) { }

    async create(formDto: Form): Promise<Form> {
        try {
            const createdForm = new this.formModel(formDto);
            return await createdForm.save();
        } catch (error) {
            Logger.error('Error creating form:', error);
            throw new Error('Error creating form');
        }
    }

    async findAll(): Promise<Form[]> {
        try {
            return this.formModel.find().exec();
        } catch (error) {
            Logger.error('Error fetching forms:', error);
            throw new Error('Error fetching forms');
        }
    }
}