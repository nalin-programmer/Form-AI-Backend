import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from 'src/forms/schemas/forms.schema';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { ResponseSchema } from './schemas/response.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Response.name, schema: ResponseSchema },
            { name: Form.name, schema: FormSchema },
        ]),
    ],
    controllers: [ResponseController],
    providers: [ResponseService],
})
export class ResponseModule { }