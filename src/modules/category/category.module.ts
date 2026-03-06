import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../db-schema/category.entity';
import { BlogCategory } from '../../../db-schema/blog-category.entity';
import { ContentCategory } from '../../../db-schema/content-category.entity';
import { CategoryController } from './category.controller';
import { BlogCategoryController } from './blog-category.controller';
import { ContentCategoryController } from './content-category.controller';
import { CategoryService } from './category.service';
import { BlogCategoryService } from './blog-category.service';
import { ContentCategoryService } from './content-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, BlogCategory, ContentCategory])],
  controllers: [CategoryController, BlogCategoryController, ContentCategoryController],
  providers: [CategoryService, BlogCategoryService, ContentCategoryService],
  exports: [CategoryService, BlogCategoryService, ContentCategoryService],
})
export class CategoryModule {}
