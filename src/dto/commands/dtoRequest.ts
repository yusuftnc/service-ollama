import { ApiProperty } from '@nestjs/swagger';

export class DtoOLLAMARequest {
  @ApiProperty()
  model: string;

  @ApiProperty()
  prompt?: string;

  @ApiProperty()
  messages?: { role: "system" | "user" | "assistant"; content: string }[];

  @ApiProperty()
  stream?: boolean;
}

