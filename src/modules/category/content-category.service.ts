import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCategory } from '../../../db-schema/content-category.entity';
import { CreateContentCategoryDto } from './dtos/create-content-category.dto';
import { UpdateContentCategoryDto } from './dtos/update-content-category.dto';

@Injectable()
export class ContentCategoryService {
  constructor(@InjectRepository(ContentCategory) private readonly contentCategoryRepository: Repository<ContentCategory>) {}

  async create(dto: CreateContentCategoryDto): Promise<{ message: string; data: ContentCategory }> {
    const exists = await this.contentCategoryRepository.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Content category with slug '${dto.slug}' already exists`);
    const category = this.contentCategoryRepository.create(dto);
    const saved = await this.contentCategoryRepository.save(category);
    return { message: 'Content category created successfully', data: saved };
  }

  async findAll(search?: string, status?: string): Promise<{ message: string; data: ContentCategory[] }> {
    const query = this.contentCategoryRepository.createQueryBuilder('cc');
    if (search) query.andWhere('(LOWER(cc.name::text) LIKE LOWER(:search) OR LOWER(cc.slug) LIKE LOWER(:search))', { search: `%${search}%` });
    if (status) query.andWhere('cc.status = :status', { status });
    const data = await query.orderBy('cc.createdAt', 'DESC').getMany();
    return { message: 'Content categories retrieved successfully', data };
  }

  async findOne(id: number): Promise<{ message: string; data: ContentCategory }> {
    const category = await this.contentCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Content category with ID ${id} not found`);
    return { message: 'Content category retrieved successfully', data: category };
  }

  async findBySlug(slug: string): Promise<{ message: string; data: ContentCategory }> {
    const category = await this.contentCategoryRepository.findOne({ where: { slug } });
    if (!category) throw new NotFoundException(`Content category with slug '${slug}' not found`);
    return { message: 'Content category retrieved successfully', data: category };
  }

  async update(id: number, dto: UpdateContentCategoryDto): Promise<{ message: string; data: ContentCategory }> {
    const category = await this.contentCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Content category with ID ${id} not found`);
    if (dto.slug && dto.slug !== category.slug) {
      const exists = await this.contentCategoryRepository.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException(`Content category with slug '${dto.slug}' already exists`);
    }
    Object.assign(category, dto);
    const updated = await this.contentCategoryRepository.save(category);
    return { message: 'Content category updated successfully', data: updated };
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.contentCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Content category with ID ${id} not found`);
    await this.contentCategoryRepository.softDelete(id);
    return { message: 'Content category deleted successfully' };
  }

  async restore(id: number): Promise<{ message: string; data: ContentCategory }> {
    await this.contentCategoryRepository.restore(id);
    const category = await this.contentCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Content category with ID ${id} not found`);
    return { message: 'Content category restored successfully', data: category };
  }
}
