import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Import ConfigModule
import { MINIO_TOKEN } from './minio.decorator';
import * as Minio from 'minio';

@Global()
@Module({
    imports: [ConfigModule], // <-- Add this line
    exports: [MINIO_TOKEN],
    providers: [
        {
            inject: [ConfigService],
            provide: MINIO_TOKEN,
            useFactory: async (
                configService: ConfigService,
            ): Promise<Minio.Client> => {
                const client = new Minio.Client({
                    endPoint: configService.getOrThrow("MINIO_ENDPOINT"),
                    port: +configService.getOrThrow("MINIO_PORT"),
                    accessKey: configService.getOrThrow("MINIO_ACCESS_KEY"),
                    secretKey: configService.getOrThrow("MINIO_SECRET_KEY"),
                    useSSL: false,
                });
                return client;
            },
        },
    ],
})
export class MinioModule { }