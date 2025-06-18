import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { InjectMinio } from 'src/minio/minio.decorator';
import { Multer } from 'multer';
import { UploadFileDto } from './dtos/upload_file.dto';
import { PageType } from 'src/enums/page_type.enums';
import { FetchFileDto } from './dtos/fetch_file.dto';

@Injectable()
export class FilesService {
    protected _bucketName = 'main';

    constructor(@InjectMinio() private readonly minioService: Minio.Client) { }

    async bucketsList() {
        return await this.minioService.listBuckets();
    }

    async getFile(filename: string) {
        return await this.minioService.presignedUrl(
            'GET',
            this._bucketName,
            filename,
        );
    }

    uploadFile(file: Multer.File, uploadFileDto: UploadFileDto) {
        return new Promise((resolve, reject) => {
            let filename = `formID_${uploadFileDto.form_id}/${uploadFileDto.page_type}`;
            if (uploadFileDto.page_type === PageType.QUESTION && uploadFileDto.question_no) {
                filename += `_${uploadFileDto.question_no.toString()}`;
            }
            // const originalNameWithoutExt = file.originalname.split('.').slice(0, -1).join('.') || file.originalname;
            const fileExt = file.originalname.includes('.') ? '.' + file.originalname.split('.').pop() : '';
            filename += `${fileExt}`;
            this.minioService.putObject(
                this._bucketName,
                filename,
                file.buffer,
                file.size,
                (error, objInfo) => {
                    if (error) {
                        Logger.log(`Error in uploading file: ${error}`)
                        reject(error);
                    } else {
                        resolve({ objInfo, filename });
                    }
                },
            );
        });
    }
}
