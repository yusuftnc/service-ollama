import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlobalResponse } from '../types/GlobalResponse';
import { OLLAMA_API_URL } from '../utils/API';
import { firstValueFrom } from 'rxjs';
import { IOLLAMARequest } from '../types/commands/request';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CommandsService {
  constructor(private httpService: HttpService) {}

  /**
   * Generic HTTP request helper for Ollama API
   */
  private async makeOllamaRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any,
    responseValidator?: (response: any) => boolean,
    successMessage?: string
  ): Promise<GlobalResponse> {
    try {
      const url = this.buildOllamaUrl(endpoint);
      
      const httpRequest = method === 'GET' 
        ? this.httpService.get(url)
        : this.httpService.post(url, data);

      const response = await firstValueFrom(httpRequest)
        .catch(error => {
          console.log('HTTP Request Error:', error);
          return { status: false, message: error, data: null };
        });

      console.log('response.data ==>', response.data);

      // Response validation
      if (!this.validateResponse(response, responseValidator)) {
        return {
          status: false,
          message: 'Invalid response format',
          data: null,
        };
      }

      return {
        status: true,
        message: successMessage || 'Request sent successfully',
        data: response.data,
      };

    } catch (error) {
      console.log('Service Error:', error);
      throw new Error(error);
    }
  }

  /**
   * Stream response için özel request helper
   */
  private makeStreamRequest(
    endpoint: string,
    data: any
  ): Observable<any> {
    const url = this.buildOllamaUrl(endpoint);
    console.log('Stream Request URL:', url);
    console.log('Stream Request Data:', data);
    
    return new Observable(subscriber => {
      this.httpService.post(url, data, {
        responseType: 'stream',
      }).subscribe({
        next: (response) => {
          console.log('Stream Response received');
          response.data.on('data', (chunk: Buffer) => {
            console.log('Raw chunk:', chunk.toString());
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
              if (line.trim()) {
                try {
                  const jsonData = JSON.parse(line);
                  console.log('Parsed JSON:', jsonData);
                  subscriber.next(jsonData);
                } catch (e) {
                  console.error('JSON parse error:', e, 'Line:', line);
                }
              }
            }
          });

          response.data.on('end', () => {
            console.log('Stream ended');
            subscriber.complete();
          });

          response.data.on('error', (err: Error) => {
            console.error('Stream error:', err);
            subscriber.error(err);
          });
        },
        error: (error) => {
          console.error('HTTP request error:', error);
          subscriber.error(error);
        }
      });
    });
  }

  /**
   * URL builder helper
   */
  private buildOllamaUrl(endpoint: string): string {
    return `${OLLAMA_API_URL}${endpoint}`;
  }

  /**
   * Response validation helper
   */
  private validateResponse(response: any, validator?: (response: any) => boolean): boolean {
    if (!response || response.status === false) {
      return false;
    }

    if (validator) {
      return validator(response);
    }

    return !!response.data;
  }

  /**
   * Response validators for different endpoints
   */
  private validateGenerateResponse = (response: any): boolean => {
    return !!response?.data?.response;
  };

  private validateChatResponse = (response: any): boolean => {
    return !!response?.data?.message;
  };

  private validateModelsResponse = (response: any): boolean => {
    return !!response?.data?.models;
  };

  /**
   * QNA endpoint - uses /api/generate
   */
  async qna(request: IOLLAMARequest): Promise<GlobalResponse | Observable<any>> {
    // Stream is true ise stream response dön
    if (request.stream) {
      return this.makeStreamRequest('/api/generate', request);
    }
    
    // Normal response için
    return this.makeOllamaRequest(
      'POST',
      '/api/generate',
      request,
      this.validateGenerateResponse,
      'QNA request sent successfully'
    );
  }

  /**
   * Chat endpoint - uses /api/chat
   */
  async chat(request: IOLLAMARequest): Promise<GlobalResponse | Observable<any>> {
    // Stream is true ise stream response dön
    if (request.stream) {
      return this.makeStreamRequest('/api/chat', request);
    }

    // Normal response için
    return this.makeOllamaRequest(
      'POST',
      '/api/chat',
      request,
      this.validateChatResponse,
      'Chat request sent successfully'
    );
  }

  /**
   * Models endpoint - uses /api/tags
   */
  async models(): Promise<GlobalResponse> {
    return this.makeOllamaRequest(
      'GET',
      '/api/tags',
      null,
      this.validateModelsResponse,
      'Models request sent successfully'
    );
  }
}
