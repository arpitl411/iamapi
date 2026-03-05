import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsInt,
  IsEmail,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  guard_name!: string;

  @IsOptional()
  @IsEmail()
  user_email?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  permission_ids?: number[];
}
