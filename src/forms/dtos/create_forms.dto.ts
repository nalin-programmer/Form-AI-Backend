import { IsString, IsNotEmpty, MaxLength, MinLength, ValidateNested, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionDto } from './create_form_question.dto'; // Adjust import path if needed
import { CreateFormsImageDto } from './create_forms_image.dto';

export class CreateFormDto {
    @ApiProperty({
        example: 'Customer Feedback',
        description: 'The title of the form.',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    title: string;

    @ApiProperty({
        example: 'This form is used to collect customer feedback.',
        description: 'Detailed description of the form.',
        minLength: 1,
        maxLength: 500,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(500)
    description: string;

    @ApiProperty({
        type: [CreateQuestionDto],
        description: 'List of questions in the form.',
        default: [],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];

    @IsObject()
    @ValidateNested()
    @Type(() => CreateFormsImageDto)
    background_images: CreateFormsImageDto[];
}
