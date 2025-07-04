import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { MinioModule } from "./minio.module";

@Module({
    imports: [
        MinioModule
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule { }