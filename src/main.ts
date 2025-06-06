import { NestFactory } from '@nestjs/core';
//import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ollama Service')
    .setDescription('ollama Services')
    .setVersion('1.0')
    .addServer('/ollama/v1')
    .addTag('commands')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('ollama/v1/api', app, document);
  app.setGlobalPrefix('ollama/v1');
  
  await app.listen(3000);

}

bootstrap();
