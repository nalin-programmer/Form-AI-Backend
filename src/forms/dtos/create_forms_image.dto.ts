import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFormsImageDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    welcome: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    personal_information: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    thank_you: string;
}