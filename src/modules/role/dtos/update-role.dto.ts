import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  guard_name?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permission_ids?: number[];
}
