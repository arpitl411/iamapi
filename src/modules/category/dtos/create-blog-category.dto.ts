import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ description: 'Blog ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  blogId: number;

  @ApiProperty({ description: 'Category ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
