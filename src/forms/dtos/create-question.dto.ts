import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({ example: 1, description: 'The order number of the question.' })
    @IsNotEmpty()
    question_no: number;

    @ApiProperty({ example: 'How satisfied are you with our service?' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: 'rating' }) // e.g., 'text', 'rating', 'multiple-choice'
    @IsString()
    @IsNotEmpty()
    type: string;
}
export class CreateQuestionWithOptionsDto extends CreateQuestionDto {
    @ApiProperty({ example: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'], required: false })
    options?: string[];

    @ApiProperty({ example: 'https://example.com/image.png', required: false })
    image?: string;
}