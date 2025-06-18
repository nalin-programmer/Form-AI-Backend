import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseType } from 'src/enums/response_type.enum';
import { PageType } from 'src/enums/page_type.enums';

export class FetchFileDto {
    @ApiProperty({ example: 'formID_form_12345/welcome_page', description: 'file path that need to be fetched' })
    @IsNotEmpty()
    @IsString()
    file_path: string;
}