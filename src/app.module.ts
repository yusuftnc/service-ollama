import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsController } from './commands/commands.controller';
import { CommandsService } from './commands/commands.service';


@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [
    AppController,
    CommandsController
  ],
  providers: [AppService, CommandsService],
})
export class AppModule {}
