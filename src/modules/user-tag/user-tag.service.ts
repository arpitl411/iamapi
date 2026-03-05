import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'db-schema/tag.entity';
import { UserTag } from 'db-schema/user-tag.entity';
import { Repository } from 'typeorm';
import { CreateUserTagDto } from './dtos/create-user-tag.dto';
import { applyPagination } from 'src/helper/query.helper';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class UserTagService {
  constructor(
    @InjectRepository(UserTag)
    private readonly userTagRepository: Repository<UserTag>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(dto: CreateUserTagDto) {
    const { userId, name } = dto;

    return await this.userTagRepository.manager.transaction(async (manager) => {
      let tag = await manager
        .createQueryBuilder(Tag, 'tag')
        .where('LOWER(tag.name) = LOWER(:name)', { name: name.trim() })
        .getOne();

      if (!tag) {
        tag = manager.create(Tag, {
          name: name.trim(),
        });

        tag = await manager.save(Tag, tag);
      }

      const existing = await manager.findOne(UserTag, {
        where: {
          userId,
          tagId: tag.id,
        },
      });

      if (existing) {
        throw new ConflictException('Tag already assigned to user');
      }
      const userTag = manager.create(UserTag, {
        userId,
        tagId: tag.id,
      });

      return await manager.save(UserTag, userTag);
    });
  }

  async getAllUserTag(query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

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

    if (query.search) {
      queryBuilder.andWhere('LOWER(tag.name) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

     if (query.userId) {
    queryBuilder.andWhere('userTag.userId = :userId', {
      userId: query.userId,
    });
  }

    const pagination = applyPagination(
      queryBuilder,
      page,
      limit,
      'userTag',
      query.sort,
    );

    const [records, totalItems] = await queryBuilder.getManyAndCount();

    pagination.totalItems = totalItems;
    pagination.totalPages = Math.ceil(totalItems / limit);

    // Format clean response
    const data = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      tagId: record.tagId,
      tagName: record.tag?.name || null,
      createdAt: record.createdAt,
    }));

    return {
      message: 'All user tags fetched successfully',
      data,
      pagination,
    };
  }

  async updateUserTag(id: number, payload: Partial<Tag>) {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    Object.assign(tag, payload);

    return this.tagRepository.save(tag);
  }

  async deleteUserTag(id: number) {
  const result = await this.tagRepository.delete(id);

  if (!result.affected) {
    throw new NotFoundException('Tag not found');
  }

  return {
    message: 'Tag deleted successfully',
    deletedId: id,
  };
}

}
