import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam, ApiCreatedResponse } from '@nestjs/swagger'; // You may need to create this DTO
import { UploadFileDto } from './dtos/upload_file.dto';
import { FetchFileDto } from './dtos/fetch_file.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {

    constructor(readonly service: FilesService) { }

    @ApiOperation({ summary: 'List all MinIO buckets' })
    @ApiResponse({ status: 200, description: 'List of buckets.' })
    @Get('buckets')
    bucketsList() {
        return this.service.bucketsList();
    }


    @Post('file-url')
    @ApiOperation({ summary: 'Get a presigned file URL from MinIO by file_path' })
    @ApiResponse({ status: 200, description: 'Presigned file URL.' })
    @ApiBody({ type: FetchFileDto })
    async getFileByPath(@Body() fetchFileDto: FetchFileDto) {
        return this.service.getFile(fetchFileDto.file_path);
    }

    // @ApiOperation({ summary: 'Upload a file to MinIO' })
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     description: 'File to upload',
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             file: {
    //                 type: 'string',
    //                 format: 'binary',
    //                 description: 'The file to upload',
    //             },
    //         },
    //         required: ['file'],
    //     },
    // })


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ description: 'Form created successfully', type: UploadFileDto })
    @ApiResponse({ status: 201, description: 'File uploaded.' })
    @ApiBody({
        description: 'Upload file and metadata',
        type: UploadFileDto,
    })
    uploadFile(
        @UploadedFile() file: MulterFile,
        @Body() uploadFileDto: UploadFileDto
    ) {
        return this.service.uploadFile(file, uploadFileDto);
    }
}
