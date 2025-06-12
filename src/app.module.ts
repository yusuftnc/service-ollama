import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsController } from './commands/commands.controller';
import { CommandsService } from './commands/commands.service';
import { ApiKeyGuard } from './guards/api-key.guard';


@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 120000, // 2 dakika
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [
    AppController,
    CommandsController
  ],
  providers: [
    AppService, 
    CommandsService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
