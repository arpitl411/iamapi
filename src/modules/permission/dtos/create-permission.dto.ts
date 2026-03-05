import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  guard_name!: string;
}
