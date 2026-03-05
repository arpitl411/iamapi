import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from 'db-schema/role.entity';
import { Permission } from 'db-schema/permission.entity';
import { User } from 'db-schema/user.entity';
import { serialize } from 'src/common/helpers/serialize.helper';
import { getPaginationOptions } from 'src/common/helpers/pagination.helper';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleResponseDto } from './dtos/role-response.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Internal helper — returns raw Role entity for mutation operations
  private async findRoleOrFail(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<ServiceResponse<RoleResponseDto>> {
    const { permission_ids, user_email, ...roleData } = createRoleDto;

    const existingRole = await this.roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name '${roleData.name}' already exists`,
      );
    }

    const role = this.roleRepository.create(roleData);

    if (permission_ids && permission_ids.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(permission_ids) },
      });

      if (permissions.length !== permission_ids.length) {
        throw new BadRequestException('Some permission IDs are invalid');
      }

      role.permissions = permissions;
    }

    const savedRole = await this.roleRepository.save(role);

    if (user_email) {
      await this.handleUserRoleAssignment(user_email, savedRole);
    }

    const roleWithPermissions = await this.roleRepository.findOne({
      where: { id: savedRole.id },
      relations: ['permissions'],
    });

    this.logger.log(`Role created: ${savedRole.name}`);

    return {
      message: 'Role created successfully',
      data: serialize(RoleResponseDto, roleWithPermissions!),
    };
  }

  private async handleUserRoleAssignment(
    userEmail: string,
    role: Role,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      relations: ['roles'],
    });

    if (user) {
      // User exists, assign the role
      if (user.roles && !user.roles.find((r) => r.id === role.id)) {
        user.roles.push(role);
        await this.userRepository.save(user);
      }
    } else {
      const defaultRole = await this.roleRepository.findOne({
        where: { name: 'org-admin' },
      });
      const newUser = this.userRepository.create({
        email: userEmail,
        first_name: 'New',
        last_name: 'User',
        userName: userEmail.split('@')[0],
        phoneCountryCode: '',
        phoneNo: '',
        profilePic: '',
        profilePic2: '',
        profilePic3: '',
        timezone: new Date(),
        roles: defaultRole ? [defaultRole, role] : [role],
      });

      await this.userRepository.save(newUser);
    }
  }

  async getAllRoles(
    pagination?: PaginationOptions,
  ): Promise<ServiceResponse<RoleResponseDto[]>> {
    const { skip, take } = getPaginationOptions(
      pagination ?? { page: 1, limit: 10 },
    );

    const [roles, total] = await this.roleRepository.findAndCount({
      relations: ['permissions'],
      skip,
      take,
    });

    return {
      message: 'Roles fetched successfully',
      data: serialize(RoleResponseDto, roles),
      meta: {
        page: pagination?.page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getRoleById(id: number): Promise<ServiceResponse<RoleResponseDto>> {
    const role = await this.findRoleOrFail(id);
    return {
      message: 'Role fetched successfully',
      data: serialize(RoleResponseDto, role),
    };
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ServiceResponse<RoleResponseDto>> {
    const role = await this.findRoleOrFail(id);
    const { permission_ids, ...roleData } = updateRoleDto;

    if (roleData.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          `Role with name '${roleData.name}' already exists`,
        );
      }
    }

    Object.assign(role, roleData);

    if (permission_ids !== undefined) {
      if (permission_ids.length > 0) {
        const permissions = await this.permissionRepository.find({
          where: { id: In(permission_ids) },
        });

        if (permissions.length !== permission_ids.length) {
          throw new BadRequestException('Some permission IDs are invalid');
        }

        role.permissions = permissions;
      } else {
        // Empty array → remove all permissions
        role.permissions = [];
      }
    }

    const updatedRole = await this.roleRepository.save(role);
    this.logger.log(`Role updated: id=${id}`);

    const roleWithPermissions = await this.roleRepository.findOne({
      where: { id: updatedRole.id },
      relations: ['permissions'],
    });

    return {
      message: 'Role updated successfully',
      data: serialize(RoleResponseDto, roleWithPermissions!),
    };
  }

  async deleteRole(id: number): Promise<ServiceResponse<null>> {
    const role = await this.findRoleOrFail(id);
    await this.roleRepository.remove(role);
    this.logger.log(`Role deleted: id=${id}`);
    return { message: 'Role deleted successfully', data: null };
  }
}
