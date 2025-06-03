import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateResponseDto {
    @ApiProperty({
        example: 'response123',
        description: 'ID of the response being updated.',
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    response_id: string;

    @ApiProperty({
        example: 1,
        description: 'Question number being answered.',
    })
    @IsNumber()
    @IsNotEmpty()
    question_no: number;

    @ApiProperty({
        example: 'Blue',
        description: 'Response to the question being answered.',
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    response: string;
}