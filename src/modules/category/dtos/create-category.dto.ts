import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Technology' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tile picture URL', required: false })
  @IsOptional()
  @IsString()
  tilePic?: string;

  @ApiProperty({ description: 'Category alias', required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: 'Translations object', required: false })
  @IsOptional()
  @IsObject()
  translations?: Record<string, any>;

  @ApiProperty({ description: 'Configs object', required: false })
  @IsOptional()
  @IsObject()
  configs?: Record<string, any>;

  @ApiProperty({ description: 'Status', required: false, default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
