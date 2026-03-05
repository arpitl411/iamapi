import { Expose } from 'class-transformer';

export class PermissionResponseDto {
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

  // roles relation → never exposed (prevents circular serialization)
}
