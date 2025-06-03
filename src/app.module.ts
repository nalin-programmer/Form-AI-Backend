import { Module, Res } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsModule } from './forms/forms.module';
import { ResponseModule } from './response/response.model';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/form-ai'),
    FormsModule,
    ResponseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
