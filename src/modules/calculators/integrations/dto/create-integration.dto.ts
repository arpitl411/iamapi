import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { IntegrationType, HttpMethod, IntegrationTrigger } from '../../common/enums';

export class CreateIntegrationDto {
  @ApiProperty({ description: 'Name of the integration', example: 'Send to CRM' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of integration', enum: IntegrationType, example: IntegrationType.WEBHOOK })
  @IsNotEmpty()
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({ description: 'URL endpoint', example: 'https://api.example.com/webhooks/calculator' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'HTTP method', enum: HttpMethod, example: HttpMethod.POST })
  @IsNotEmpty()
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @ApiProperty({ 
    description: 'HTTP headers', 
    required: false,
    example: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token123' }
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiProperty({ 
    description: 'Payload mapping (calculator variables to API payload keys)', 
    required: false,
    example: { user_age: 'age', monthly_premium: 'premium' }
  })
  @IsOptional()
  @IsObject()
  payloadMapping?: Record<string, string>;

  @ApiProperty({ 
    description: 'Response mapping (API response keys to calculator variables)', 
    required: false,
    example: { result: 'api_result', status: 'api_status' }
  })
  @IsOptional()
  @IsObject()
  responseMapping?: Record<string, string>;

  @ApiProperty({ description: 'When to trigger', enum: IntegrationTrigger, example: IntegrationTrigger.ON_SUBMIT })
  @IsNotEmpty()
  @IsEnum(IntegrationTrigger)
  triggerOn: IntegrationTrigger;

  @ApiProperty({ description: 'Whether integration is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
