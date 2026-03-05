import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'db-schema/tag.entity';
import { UserTag } from 'db-schema/user-tag.entity';
import { Repository } from 'typeorm';
import { CreateUserTagDto } from './dtos/create-user-tag.dto';
import { serialize } from 'src/common/helpers/serialize.helper';
import { TagResponseDto } from './dtos/tag-response.dto';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { getPaginationOptions } from 'src/common/helpers/pagination.helper';

@Injectable()
export class UserTagService {
  private readonly logger = new Logger(UserTagService.name);
  constructor(
    @InjectRepository(UserTag)
    private readonly userTagRepository: Repository<UserTag>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createUserTag(
    dto: CreateUserTagDto,
  ): Promise<ServiceResponse<TagResponseDto>> {
    const { userId, name } = dto;

    const result = await this.userTagRepository.manager.transaction(
      async (manager) => {
        const normalizedName = name.trim().toLowerCase();

        let tag = await manager
          .createQueryBuilder(Tag, 'tag')
          .where('LOWER(tag.name) = :name', { name: normalizedName })
          .getOne();

        if (!tag) {
          tag = manager.create(Tag, {
            name: name.trim(),
          });

          tag = await manager.save(Tag, tag);
        }

        const exists = await manager.findOne(UserTag, {
          where: {
            userId,
            tagId: tag.id,
          },
        });

        if (exists) {
          throw new ConflictException('Tag already assigned to user');
        }
        const userTag = manager.create(UserTag, {
          userId,
          tagId: tag.id,
        });

        return await manager.save(UserTag, userTag);
      },
    );

    this.logger.log(`Tag assigned to user ${userId}: ${name}`);

    return {
      message: 'User tag created successfully',
      data: serialize(TagResponseDto, result),
    };
  }

  async getAllUserTag(
    pagination?: PaginationOptions,
    query?: { search?: string; userId?: number },
  ): Promise<ServiceResponse<any[]>> {
    const { skip, take } = getPaginationOptions(
      pagination ?? { page: 1, limit: 10 },
    );

    const queryBuilder = this.userTagRepository
      .createQueryBuilder('userTag')
      .leftJoin('userTag.tag', 'tag')
      .select([
        'userTag.id',
        'userTag.userId',
        'userTag.tagId',
        'userTag.createdAt',
        'tag.id',
        'tag.name',
      ]);

    if (query?.search) {
      queryBuilder.andWhere('LOWER(tag.name) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    if (query?.userId) {
      queryBuilder.andWhere('userTag.userId = :userId', {
        userId: query.userId,
      });
    }

    queryBuilder.skip(skip).take(take);

    const [records, total] = await queryBuilder.getManyAndCount();

    const data = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      tagId: record.tagId,
      tagName: record.tag?.name ?? null,
      createdAt: record.createdAt,
    }));

    return {
      message: 'User tags fetched successfully',
      data,
      meta: {
        page: pagination?.page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateUserTag(
    id: number,
    updateUserTagDto: CreateUserTagDto,
  ): Promise<ServiceResponse<TagResponseDto>> {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    Object.assign(tag, updateUserTagDto);

    const updatedTag = await this.tagRepository.save(tag);

    this.logger.log(`Tag updated: id=${id}`);

    return {
      message: 'Tag updated successfully',
      data: serialize(TagResponseDto, updatedTag),
    };
  }

  async deleteUserTag(id: number) {
    const result = await this.tagRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Tag not found');
    }
    this.logger.log(`User deleted: id=${id}`);
    return { message: 'Tag deleted successfully', data: null };
  }
}
