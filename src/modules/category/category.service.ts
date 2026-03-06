import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../db-schema/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async create(dto: CreateCategoryDto): Promise<{ message: string; data: Category }> {
    const category = this.categoryRepository.create(dto);
    const saved = await this.categoryRepository.save(category);
    return { message: 'Category created successfully', data: saved };
  }

  async findAll(search?: string): Promise<{ message: string; data: Category[] }> {
    const query = this.categoryRepository.createQueryBuilder('category');
    if (search) query.andWhere('LOWER(category.name) LIKE LOWER(:search)', { search: `%${search}%` });
    const data = await query.orderBy('category.createdAt', 'DESC').getMany();
    return { message: 'Categories retrieved successfully', data };
  }

  async findOne(id: number): Promise<{ message: string; data: Category }> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    return { message: 'Category retrieved successfully', data: category };
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<{ message: string; data: Category }> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    Object.assign(category, dto);
    const updated = await this.categoryRepository.save(category);
    return { message: 'Category updated successfully', data: updated };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Category with ID ${id} not found`);
    return { message: 'Category deleted successfully' };
  }
}
