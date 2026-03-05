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
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

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

  /**
   * Permission IDs to attach to the role via role_has_permissions.
   * These are merged with any existing permissions for the role.
   */
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

  /** Defaults to 1 as per business rule */
  @IsOptional()
  @IsNumber()
  personaId?: number;

  /** Defaults to true as per business rule */
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
