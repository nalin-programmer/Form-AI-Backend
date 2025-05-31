import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/form-ai'),
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
