import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseType } from 'src/enums/response_type.enum';

export class CreateQuestionDto {
    @ApiProperty({ example: 1, description: 'The order number of the question.' })
    @IsNotEmpty()
    question_no: number;

    @ApiProperty({ example: 'How satisfied are you with our service?' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: 'rating', enum: ResponseType, description: 'Response type' })
    @IsEnum(ResponseType)
    @IsNotEmpty()
    type: ResponseType;
}
export class CreateQuestionWithOptionsDto extends CreateQuestionDto {
    @ApiProperty({ example: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'], required: false })
    options?: string[];

    @ApiProperty({ example: 'https://example.com/image.png', required: false })
    image?: string;
}