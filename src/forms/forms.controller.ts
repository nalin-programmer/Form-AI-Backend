import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form } from './forms.schema';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from './dtos/create_forms.dto';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all forms', description: 'Retrieves all forms from the database.' })
    @ApiResponse({ status: 200, description: 'List of forms returned successfully.', type: [Form] })
    async getAllForms(): Promise<Form[]> {
        return await this.formsService.findAll();
    }

    @Post()
    @ApiCreatedResponse({ description: 'Form created successfully', type: CreateFormDto })
    @ApiBody({ type: CreateFormDto })
    async createForm(@Body() formDto: CreateFormDto): Promise<Form> {
        return await this.formsService.create(formDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a form', description: 'Deletes a form by its ID.' })
    async deleteForm(@Param('id') id: string): Promise<Form | null> {
        return await this.formsService.deleteById(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a form by ID', description: 'Retrieves a specific form by its ID.' })
    @ApiResponse({ status: 200, description: 'Form retrieved successfully.', type: Form })
    async getFormById(@Param('id') id: string): Promise<Form | null> {
        return await this.formsService.findById(id);
    }
}