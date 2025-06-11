import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GlobalResponse } from '../types/GlobalResponse';
import {
  DtoOLLAMARequest,
} from '../dto/commands/dtoRequest';
import { CommandsService } from './commands.service';
import { OollamaType, OutputType } from './commands.enum';
import { DtoGlobalResponse } from 'src/dto/dtoGlobalResponse';

//@ApiTags('commands')
@Controller('')
export class CommandsController {
  constructor(private readonly commandService: CommandsService) {}

  @Post('/qna')
  @HttpCode(200)
  @ApiSecurity('x-api-key')
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaQNA(
    //@Query('serial_no') serial_no: string,
    @Body() request: DtoOLLAMARequest,
  ): Promise<GlobalResponse> {
    try {
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
  @ApiSecurity('x-api-key')
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaChat(
    //@Query('serial_no') serial_no: string,
    @Body() request: DtoOLLAMARequest,
  ): Promise<GlobalResponse> {
    try {
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
  @ApiSecurity('x-api-key')
  @ApiResponse({ status: 200, description: 'OK', type: DtoGlobalResponse })
  async ollamaModels(): Promise<GlobalResponse> {
    try {
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
