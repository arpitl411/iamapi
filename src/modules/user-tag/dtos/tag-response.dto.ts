import { Expose } from 'class-transformer';

export class TagResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}