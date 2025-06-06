import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlobalResponse } from '../types/GlobalResponse';
import { OLLAMA_API_URL } from '../utils/API';
import { firstValueFrom } from 'rxjs';
import { IOLLAMARequest } from '../types/commands/request';

@Injectable()
export class CommandsService {
  constructor(private httpService: HttpService) {}

  async qna(request: IOLLAMARequest): Promise<GlobalResponse> {
    try {
      const qnaUrl = `${OLLAMA_API_URL}/api/generate`;

      const response = await firstValueFrom(
        this.httpService.post(qnaUrl, request)
      ).catch(error => { return { status: false,  message: error,  data: null} });
        
      console.log('response.data ==> ',response.data)
      if (!response?.data?.messages) {
        return {
          status: false,
          message: '',
          data: null,
        };
      }

      return {
        status: true,
        message: 'QNA request sent successfully',
        data: response.data,
      };      
    } catch (error) {
      console.log("error",error)
      throw new Error(error);
    }
  }
// BURADA KOD TEKRARI VAR HALLET
  async chat(request: IOLLAMARequest): Promise<GlobalResponse> {
    try {
      const chatUrl = `${OLLAMA_API_URL}/api/chat`;

      const response = await firstValueFrom(
        this.httpService.post(chatUrl, request)
      ).catch(error => { return { status: false,  message: error,  data: null} });
        
      console.log('response.data ==> ',response.data)
      if (!response?.data?.messages) {
        return {
        status: false,
        message: '',
        data: null,
      };
      }

      return {
        status: true,
        message: 'Chat request sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.log("error",error)
      throw new Error(error);
    }
  }

  async models(): Promise<GlobalResponse> {
    try {
      const modelsUrl = `${OLLAMA_API_URL}/api/tags`;

      const response = await firstValueFrom(
        this.httpService.get(modelsUrl)
      ).catch(error => { return { status: false,  message: error,  data: null} });
        
      console.log('response.data ==> ',response.data)
      if (!response?.data?.models) {
        return {
        status: false,
        message: '',
        data: null,
      };
      }

      return {
        status: true,
        message: 'Models request sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.log("error",error)
      throw new Error(error);
    }
  }
}
