import { Expose, Type } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  tilePic: string;

  @Expose()
  alias: string;

  @Expose()
  uuid: string;

  @Expose()
  lft: number;

  @Expose()
  rgt: number;

  @Expose()
  parentId: number | null;

  @Expose()
  translations: Record<string, any>;

  @Expose()
  configs: Record<string, any>;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CategoryResponseDto)
  children?: CategoryResponseDto[];
}

export class CategoryStatsDto {
  totalCategories: number;
  totalParent: number;
  totalSubCategory: number;
  totalNestedCategory: number;
  totalSpecialCategory: number;
  totalContentCategory: number;
}