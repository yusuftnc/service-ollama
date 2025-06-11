import { NestFactory } from '@nestjs/core';
//import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarları
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  const config = new DocumentBuilder()
    .setTitle('ollama Service')
    .setDescription('ollama Services')
    .setVersion('1.0')
    .addServer('/ollama/v1')
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    }, 'x-api-key')
    .addTag('commands')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('ollama/v1/api', app, document);
  app.setGlobalPrefix('ollama/v1');
  
  await app.listen(3000);

}

bootstrap();
