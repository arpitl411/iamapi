import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsObject } from 'class-validator';

export class CreateContentCategoryDto {
  @ApiProperty({ description: 'Category slug', example: 'technology' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Category name (JSON object)', example: { en: 'Technology', es: 'Tecnología' } })
  @IsNotEmpty()
  @IsObject()
  name: any;

  @ApiProperty({ description: 'Category description (JSON object)', required: false, example: { en: 'Tech content', es: 'Contenido técnico' } })
  @IsOptional()
  @IsObject()
  description?: any;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: 'Status', required: false, default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
