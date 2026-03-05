import { Expose } from 'class-transformer';

export class UserPersonaResponseDto {
  @Expose()
  id!: number;

  @Expose()
  userId!: number;

  @Expose()
  roleId!: number;

  @Expose()
  personaId!: number;

  @Expose()
  isDefault!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  // user, role relations → never exposed (prevents circular serialization)
}
