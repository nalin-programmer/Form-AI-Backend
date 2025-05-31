import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Form AI API')
    .setDescription('In today\'s digital age, the effectiveness of forms—whether for surveys, feedback, or data collection—can significantly impact user experience. Traditional forms often lack engagement, feel monotonous, and fail to provide contextual responses, leading to low completion rates and poor data quality. This is where FormAI comes in, transforming the way we interact with forms by integrating AI to create a more dynamic and engaging user experience.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
