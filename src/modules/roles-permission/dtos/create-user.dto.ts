import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  timezone?: string

  @IsOptional()
  @IsString()
  phoneCountryCode?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;

  /** Role to assign to the new user (maps to roles.id) */
  @IsNotEmpty()
  @IsNumber()
  roleId!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}

export class CreateUserPersonaDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  roleId!: number;

  @IsOptional()
  @IsNumber()
  personaId?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class AssignPermissionsToRoleDto {
  @IsNotEmpty()
  @IsNumber()
  roleId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  permissionIds!: number[];
}
