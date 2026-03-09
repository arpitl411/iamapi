import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'db-schema/category.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { getPaginationOptions } from 'src/common/helpers/pagination.helper';
import { CreateCategoryDto } from './dtos/create-categories.dto';
import { CategoryQueryDto } from './dtos/category-query.dto';

const DEFAULT_IMAGE = 'amplispot';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    dto: CreateCategoryDto,
  ): Promise<ServiceResponse<Category>> {
    const { name, parent_id, status } = dto;

    if (parent_id !== undefined && parent_id !== null) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parent_id },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with id ${parent_id} not found`,
        );
      }
    }

    const existing = await this.categoryRepository.findOne({
      where: {
        name,
        parent_id: parent_id !== undefined && parent_id !== null ? parent_id : IsNull()
      },
    });
    if (existing) {
      throw new ConflictException(
        'A category with this name already exists under the same parent',
      );
    }

    const category = this.categoryRepository.create({
      ...dto,
      tile_pic: dto.tile_pic || DEFAULT_IMAGE,
      parent_id: parent_id ?? null,
      status: status ?? 'active',
    });

    const saved = await this.categoryRepository.save(category);

    const categoryType = this.resolveCategoryType(saved);
    this.logger.log(`Created ${categoryType} category: id=${saved.id}, name=${saved.name}`);

    return {
      message: `${categoryType} category created successfully`,
      data: saved,
    };
  }

  async getAllCategories(
    pagination: PaginationOptions,
    query: CategoryQueryDto,
  ): Promise<ServiceResponse<any>> {
    const { skip, take } = getPaginationOptions(pagination);

    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children')
      .leftJoinAndSelect('category.blogCategories', 'blogCategories');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(category.name) LIKE LOWER(:search) OR LOWER(category.alias) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query?.status && query.status !== 'all') {
      qb.andWhere('category.status = :status', { status: query.status });
    }

    if (query?.type && query.type !== 'all') {
      switch (query.type) {
        case 'parent':
          qb.andWhere('category.parent_id IS NULL');
          break;
        case 'sub':
          qb.andWhere('category.parent_id IS NOT NULL')
            .leftJoin('category.parent', 'parentCat')
            .andWhere('parentCat.parent_id IS NULL');
          break;
        case 'nested':
          qb.andWhere('category.parent_id IS NOT NULL')
            .leftJoin('category.parent', 'parentCat')
            .andWhere('parentCat.parent_id IS NOT NULL');
          break;
      }
    }

    qb.skip(skip).take(take).orderBy('category.id', 'ASC');

    const [records, total] = await qb.getManyAndCount();

    const stats = await this.getCategoryStats();

    return {
      message: 'Categories fetched successfully',
      data: records,
    //   stats,
      meta: {
        page: pagination.page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getCategoryStats(): Promise<ServiceResponse<any>> {
    const totalCategories = await this.categoryRepository.count();

    const totalParent = await this.categoryRepository.count({
      where: { parent_id: IsNull() },
    });

    const totalSubcategory = await this.categoryRepository
      .createQueryBuilder('c')
      .innerJoin('c.parent', 'p')
      .where('c.parent_id IS NOT NULL')
      .andWhere('p.parent_id IS NULL')
      .getCount();

    const totalContentCategory = await this.categoryRepository
      .createQueryBuilder('c')
      .innerJoin('c.parent', 'p')
      .where('c.parent_id IS NOT NULL')
      .andWhere('p.parent_id IS NOT NULL')
      .getCount();

    const totalSpecial = await this.categoryRepository.count({
      where: { status: 'special' },
    });

    const blogsResult = await this.categoryRepository
      .createQueryBuilder('c')
      .leftJoin('c.blogCategories', 'bc')
      .select('COUNT(bc.id)', 'total')
      .getRawOne<{ total: string }>();

    const totalBlogs = parseInt(blogsResult?.total ?? '0', 10);

    const statusBreakdown = await this.categoryRepository
      .createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('COUNT(c.id)', 'count')
      .groupBy('c.status')
      .getRawMany<{ status: string; count: string }>();

    const stats = {
      totalCategories,
      totalParent,
      totalSubcategory,
      totalContentCategory,
      totalSpecial,
      totalBlogs,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: parseInt(s.count, 10),
      })),
    };

    return {
      message: 'Category stats fetched successfully',
      data: stats,
    };
  }

  async getCategoryById(id: number): Promise<ServiceResponse<Category>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'blogCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return { message: 'Category fetched successfully', data: category };
  }


  async getCategoryTree(): Promise<ServiceResponse<Category[]>> {
    const all = await this.categoryRepository.find({
      relations: ['children'],
      where: { parent_id: IsNull() },
      order: { id: 'ASC' },
    });

    return { message: 'Category tree fetched successfully', data: all };
  }


  async updateCategory(
    id: number,
    dto: Partial<CreateCategoryDto>,
  ): Promise<ServiceResponse<Category>> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (dto.parent_id !== undefined && dto.parent_id !== null) {
      if (dto.parent_id === id) {
        throw new ConflictException('A category cannot be its own parent');
      }
      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with id ${dto.parent_id} not found`,
        );
      }
    }

    Object.assign(category, dto);
    const updated = await this.categoryRepository.save(category);

    this.logger.log(`Category updated: id=${id}`);

    return { message: 'Category updated successfully', data: updated };
  }


  async deleteCategory(id: number): Promise<ServiceResponse<null>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (category.children?.length > 0) {
      throw new ConflictException(
        'Cannot delete a category that has subcategories. Remove children first.',
      );
    }

    await this.categoryRepository.delete(id);

    this.logger.log(`Category deleted: id=${id}`);

    return { message: 'Category deleted successfully', data: null };
  }


  getCategoryStatusTypes(): ServiceResponse<string[]> {
    const types = ['parent','sub','nested'];
    return { message: 'Status types fetched successfully', data: types };
  }

  private resolveCategoryType(category: Category): string {
    if (category.status === 'parent') return 'Parent';
    if (category.parent_id === null) return 'Parent';
    return 'Sub/Nested';
  }
}