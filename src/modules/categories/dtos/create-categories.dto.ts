import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  tile_pic?: string = 'amplispot'; // default image

  @IsOptional()
  @IsString()
  @MaxLength(255)
  alias?: string;

  @IsOptional()
  @IsNumber()
  parent_id?: number | null;

  @IsOptional()
  @IsObject()
  translations?: Record<string, any>;

  @IsOptional()
  @IsObject()
  configs?: Record<string, any>;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string = 'active';
}