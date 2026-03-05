import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'db-schema/permission.entity';
import { serialize } from 'src/common/helpers/serialize.helper';
import { getPaginationOptions } from 'src/common/helpers/pagination.helper';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionResponseDto } from './dtos/permission-response.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(
    dto: CreatePermissionDto,
  ): Promise<ServiceResponse<PermissionResponseDto>> {
    const exists = await this.permissionRepository.findOne({
      where: { name: dto.name, guard_name: dto.guard_name },
    });

    if (exists) {
      throw new ConflictException(
        `Permission '${dto.name}' with guard '${dto.guard_name}' already exists`,
      );
    }

    const permission = this.permissionRepository.create(dto);
    const saved = await this.permissionRepository.save(permission);
    this.logger.log(`Permission created: ${saved.name}`);

    return {
      message: 'Permission created successfully',
      data: serialize(PermissionResponseDto, saved),
    };
  }

  async getAllPermissions(
    pagination?: PaginationOptions,
  ): Promise<ServiceResponse<PermissionResponseDto[]>> {
    const { skip, take } = getPaginationOptions(
      pagination ?? { page: 1, limit: 10 },
    );

    const [permissions, total] = await this.permissionRepository.findAndCount({
      skip,
      take,
    });

    return {
      message: 'Permissions fetched successfully',
      data: serialize(PermissionResponseDto, permissions),
      meta: {
        page: pagination?.page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getPermissionById(
    id: number,
  ): Promise<ServiceResponse<PermissionResponseDto>> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return {
      message: 'Permission fetched successfully',
      data: serialize(PermissionResponseDto, permission),
    };
  }
}
