import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlobalResponse } from '../types/GlobalResponse';
import {
  DtoOLLAMARequest,
} from '../dto/commands/dtoRequest';
import { CommandsService } from './commands.service';
import { OollamaType, OutputType } from './commands.enum';
import { DtoGlobalResponse } from 'src/dto/dtoGlobalResponse';
import { X_API_KEY } from '../utils/API';

//@ApiTags('commands')
@Controller('')
export class CommandsController {
  constructor(private readonly commandService: CommandsService) {}

  @Post('/qna')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaQNA(
    //@Query('serial_no') serial_no: string,
    @Headers('x-api-key') apiKey: string,
    @Body() request: DtoOLLAMARequest,
  ): Promise<GlobalResponse> {
    try {
      if (apiKey !== X_API_KEY) {
        return {
          status: false,
          message: 'Api Key Required',
          data: {},
        };
      }
      if (!request.model) {
        return {
          status: false,
          message: 'Model Required',
          data: {},
        };
      }
    
      const response = await this.commandService.qna(request);
      if (!response.status) {
        return {
          status: false,
          message: 'Command Send Failed',
          data: {},
        };
      }

      return {
        status: true,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      console.log('catch', error);
      return {
        status: false,
        message: 'Catch Error',
        data: {},
      };
    }
  }

  @Post('/chat')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaChat(
    //@Query('serial_no') serial_no: string,
    @Headers('x-api-key') apiKey: string,
    @Body() request: DtoOLLAMARequest,
  ): Promise<GlobalResponse> {
    try {
      if (apiKey !== X_API_KEY) {
        return {
          status: false,
          message: 'Api Key Required',
          data: {},
        };
      }
      if (!request.model) {
        return {
          status: false,
          message: 'Model Required',
          data: {},
        };
      }
    
      const response = await this.commandService.chat(request);
      if (!response.status) {
        return {
          status: false,
          message: 'Command Send Failed',
          data: {},
        };
      }

      return {
        status: true,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      console.log('catch', error);
      return {
        status: false,
        message: 'Catch Error',
        data: {},
      };
    }
  }

  @Get('/models')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaModels(
    @Headers('x-api-key') apiKey: string,
  ): Promise<GlobalResponse> {
    try {
      if (apiKey !== X_API_KEY) {
        return {
          status: false,
          message: 'Api Key Required',
          data: {},
        };
      }
    
      const response = await this.commandService.models();
      if (!response.status) {
        return {
          status: false,
          message: 'Command Send Failed',
          data: {},
        };
      }

      return {
        status: true,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      console.log('catch', error);
      return {
        status: false,
        message: error.message || 'Bilinmeyen bir hata oluştu.',
        data: {},
      };
    }
  }
}
