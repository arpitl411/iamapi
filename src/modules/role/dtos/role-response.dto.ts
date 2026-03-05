import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from 'src/modules/permission/dtos/permission-response.dto';

export class RoleResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  guard_name!: string;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions!: PermissionResponseDto[];
}
