import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ResponseStatus } from 'src/enums/response_status.enum';
import { v4 as uuidv4 } from 'uuid';

export type ResponseDocument = Response & Document;

@Schema({ _id: false })
class Answer {
    @Prop({ required: true })
    question_no: string;

    @Prop({ type: [String], required: true })
    response: string[];
}

const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Response {
    @Prop({
        type: String,
        default: () => uuidv4(),
        unique: true,
        required: true,
    })
    _id: string;

    @Prop({ type: String, ref: 'Form', required: true })
    form_id: string;

    @Prop({ type: String, required: true })
    respondent_name: string;

    @Prop({ type: String, required: true })
    respondent_id: string;

    @Prop({ type: [AnswerSchema], required: true })
    response: Answer[];

    @Prop({ required: true, enum: ResponseStatus, default: ResponseStatus.IN_PROGRESS })
    status: ResponseStatus;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);