import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'db-schema/category.entity';
import { CategoryService } from './categories.service';
import { CategoryController } from './categories.controller';
import { BlogCategory } from 'db-schema/blog-category.entity';
import { PersonaCategory } from 'db-schema/persona-categories.entity';
import { OrganizationFeedCategory } from 'db-schema/organization-feed-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      Category,
      BlogCategory,
      PersonaCategory,
      OrganizationFeedCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoriesModule {}