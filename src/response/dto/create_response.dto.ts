import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateResponseDto {
    @ApiProperty({
        example: 'form123',
        description: 'ID of the form being responded to.',
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    form_id: string;

    @ApiProperty({
        example: 'Nalin',
        description: 'Name of the respondent.',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    respondent_name: string;

    @ApiProperty({
        example: 'nalinagrawal333@gmail.com',
        description: 'unique id of the respondent.',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    respondent_id: string;
}