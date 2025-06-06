import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health')
  @ApiResponse({ status: 200 })
  healthCheck(): { status: boolean, version: string } {
    return { status: true , version: '1.0.0'};
  }
}
