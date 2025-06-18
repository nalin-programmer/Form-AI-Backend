import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseType } from 'src/enums/response_type.enum';
import { PageType } from 'src/enums/page_type.enums';

export class UploadFileDto {
    @ApiProperty({ example: '1', description: 'The order number of the question.', required: false })
    @IsOptional()
    @IsString()
    question_no?: string;

    @ApiProperty({ example: 'form_12345', description: 'The unique identifier of the form.' })
    @IsString()
    @IsNotEmpty()
    form_id: string;

    @ApiProperty({ enum: PageType, description: 'The type of the page.' })
    @IsEnum(PageType)
    @IsNotEmpty()
    page_type: PageType;

    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}