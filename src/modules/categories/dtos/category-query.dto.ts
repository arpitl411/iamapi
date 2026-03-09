import { IsOptional, IsString, IsIn } from 'class-validator';

export class CategoryQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'special', 'content', 'all'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['parent', 'sub', 'nested', 'all'])
  type?: string;
}