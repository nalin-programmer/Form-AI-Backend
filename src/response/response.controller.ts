import { Body, Controller, Post, Put } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseService } from "./response.service";
import { CreateResponseDto } from "./dto/create_response.dto";
import { UpdateResponseDto } from "./dto/update_response.dto";

@ApiTags('Responses')
@Controller('responses')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new response', description: 'Creates a new response with the provided details.' })
    @ApiCreatedResponse({ description: 'Response created successfully', type: CreateResponseDto })
    @ApiBody({ type: CreateResponseDto })
    async createResponse(@Body() createResponseDto: CreateResponseDto): Promise<any> {
        return this.responseService.create(createResponseDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update an existing response', description: 'Updates an existing response with the provided details.' })
    @ApiCreatedResponse({ description: 'Response updated successfully', type: UpdateResponseDto })
    async updateResponse(@Body() updateResponseDto: UpdateResponseDto): Promise<any> {
        return this.responseService.update(updateResponseDto);
    }
}