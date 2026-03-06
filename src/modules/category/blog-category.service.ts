import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogCategory } from '../../../db-schema/blog-category.entity';
import { CreateBlogCategoryDto } from './dtos/create-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(@InjectRepository(BlogCategory) private readonly blogCategoryRepository: Repository<BlogCategory>) {}

  async create(dto: CreateBlogCategoryDto): Promise<{ message: string; data: BlogCategory }> {
    const exists = await this.blogCategoryRepository.findOne({ where: { blogId: dto.blogId, categoryId: dto.categoryId } });
    if (exists) throw new ConflictException('This category is already assigned to the blog');
    const blogCategory = this.blogCategoryRepository.create(dto);
    const saved = await this.blogCategoryRepository.save(blogCategory);
    return { message: 'Blog category created successfully', data: saved };
  }

  async findAll(blogId?: number, categoryId?: number): Promise<{ message: string; data: BlogCategory[] }> {
    const query = this.blogCategoryRepository.createQueryBuilder('bc').leftJoinAndSelect('bc.category', 'category');
    if (blogId) query.andWhere('bc.blogId = :blogId', { blogId });
    if (categoryId) query.andWhere('bc.categoryId = :categoryId', { categoryId });
    const data = await query.orderBy('bc.createdAt', 'DESC').getMany();
    return { message: 'Blog categories retrieved successfully', data };
  }

  async findOne(id: number): Promise<{ message: string; data: BlogCategory }> {
    const blogCategory = await this.blogCategoryRepository.findOne({ where: { id }, relations: ['category'] });
    if (!blogCategory) throw new NotFoundException(`Blog category with ID ${id} not found`);
    return { message: 'Blog category retrieved successfully', data: blogCategory };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.blogCategoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Blog category with ID ${id} not found`);
    return { message: 'Blog category deleted successfully' };
  }

  async removeByBlogAndCategory(blogId: number, categoryId: number): Promise<{ message: string }> {
    const result = await this.blogCategoryRepository.delete({ blogId, categoryId });
    if (result.affected === 0) throw new NotFoundException('Blog category association not found');
    return { message: 'Blog category deleted successfully' };
  }
}
