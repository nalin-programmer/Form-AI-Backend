import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ResponseType } from 'src/enums/response_type.enum';
import { v4 as uuidv4 } from 'uuid';

export type FormDocument = Form & Document;

@Schema({ _id: false })
class Question {
    @ApiProperty({ example: 1, description: 'The order number of the question.' })
    @Prop({ required: true })
    question_no: number;

    @ApiProperty({ enum: ResponseType, description: 'The type of response expected.' })
    @Prop({ required: true, enum: ResponseType })
    response_type: ResponseType;

    @ApiProperty({ example: 'What is your favorite color?', description: 'The question text.', minLength: 1, maxLength: 500 })
    @Prop({ required: true, minlength: 1, maxlength: 500 })
    question: string;

    @ApiProperty({ type: [String], required: false, example: ['Red', 'Blue'], description: 'Optional multiple-choice options.' })
    @Prop({ type: [String], required: false, default: undefined })
    options?: string[];

    @ApiProperty({ type: String, required: false, example: 'https://example.com/image.png', description: 'Optional image URL for the question.' })
    @Prop({ type: String, required: false, default: undefined })
    image?: string;
}

@Schema({ _id: false })
class BackgroundImages {
    @ApiProperty({ type: String, required: false, example: 'https://example.com/background.png', description: 'URL of the welcome image.' })
    @Prop({ type: String, required: false, default: undefined })
    welcome?: string;

    @ApiProperty({ type: String, required: false, example: 'https://example.com/logo.png', description: 'URL of the thank_you image.' })
    @Prop({ type: String, required: false, default: undefined })
    thank_you?: string;

    @ApiProperty({ type: String, required: false, example: 'https://example.com/logo.png', description: 'URL of the personal_information image.' })
    @Prop({ type: String, required: false, default: undefined })
    personal_information?: string;
}

const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Form {

    // @ApiProperty({ type: String, example: 'b5fefb28-9b90-4c6f-a6a9-42e7e4a9e95a', description: 'Unique form ID.' })
    @Prop({
        type: String,
        default: () => uuidv4(),
        required: true,
    })
    _id: string;

    @ApiProperty({ example: 'Customer Feedback', description: 'The title of the form.', minLength: 1, maxLength: 100 })
    @Prop({ required: true, minlength: 1, maxlength: 100 })
    title: string;

    @ApiProperty({ example: 'This form is used to collect customer feedback.', description: 'Detailed description of the form.', minLength: 1, maxLength: 500 })
    @Prop({ required: true, minlength: 1, maxlength: 500 })
    description: string;

    @ApiProperty({ type: [Question], description: 'List of questions in the form.' })
    @Prop({ type: [QuestionSchema], default: [] })
    questions: Question[];

    @ApiProperty({ type: BackgroundImages, description: 'Background images for the form.' })
    @Prop({ type: BackgroundImages, default: () => ({}) })
    background_images: BackgroundImages;

    @ApiProperty({ example: 0, description: 'Number of times the form has been submitted.' })
    @Prop({ type: Number, default: 0 })
    total_responses: number;


}

export const FormSchema = SchemaFactory.createForClass(Form);
