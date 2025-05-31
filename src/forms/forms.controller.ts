import { Body, Controller, Get, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form } from './forms.schema';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @ApiTags('Forms') // This groups endpoints under the "Forms" section in Swagger UI
    @Get()
    @ApiOperation({ summary: 'Retrieve all forms', description: 'Retrieves all forms from the database.' })
    @ApiResponse({ status: 200, description: 'List of forms returned successfully.', type: [Form] })
    async getAllForms(): Promise<Form[]> {
        return this.formsService.findAll();
    }

    @Post()
    @ApiCreatedResponse({ description: 'Form created successfully', type: Form })
    @ApiBody({ type: Form })
    async createForm(@Body() formDto: Form): Promise<Form> {
        return this.formsService.create(formDto);
    }
}