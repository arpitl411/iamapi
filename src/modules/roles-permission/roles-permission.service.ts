import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleHasPermission } from 'db-schema/role-has-permission.entity';
import { Role } from 'db-schema/role.entity';
import { UserPersona } from 'db-schema/user-persons.entity';
import { User } from 'db-schema/user.entity';
import {
  AssignPermissionsToRoleDto,
  CreateUserDto,
  CreateUserPersonaDto,
} from './dtos/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { DataSource, In, Repository } from 'typeorm';
import { hashPassword } from 'src/common/helpers/hash.helper';
import { serialize } from 'src/common/helpers/serialize.helper';
import { ServiceResponse } from 'src/common/interfaces/api-response.interface';
import { UserResponseDto } from 'src/modules/auth/dtos/user-response.dto';
import { UserPersonaResponseDto } from './dtos/user-persona-response.dto';
import { RoleResponseDto } from 'src/modules/role/dtos/role-response.dto';

@Injectable()
export class RolesPermissionService {
  private readonly logger = new Logger(RolesPermissionService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserPersona)
    private readonly userPersonaRepo: Repository<UserPersona>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(RoleHasPermission)
    private readonly rolePermRepo: Repository<RoleHasPermission>,

    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: CreateUserDto): Promise<
    ServiceResponse<{
      user: UserResponseDto;
      userPersona: UserPersonaResponseDto;
      role: RoleResponseDto;
      assignedPermissions: RoleHasPermission[];
    }>
  > {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" is already registered`);
    }

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) {
      throw new NotFoundException(`Role with id ${dto.roleId} not found`);
    }
    return this.dataSource.transaction(async (manager) => {
      const hashedPassword = await hashPassword(dto.password);

      const user = manager.create(User, {
        email: dto.email,
        password: hashedPassword,
        first_name: dto.first_name ?? null,
        last_name: dto.last_name ?? null,
        timezone: dto.timezone,
        phoneCountryCode: dto.phoneCountryCode,
        phoneNo: dto.phoneNo,
        uuid: uuidv4(),
        active: true,
        confirmed: false,
        newUser: true,
      });

      const savedUser = await manager.save(User, user);

      // ✅ Create persona
      const userPersona = manager.create(UserPersona, {
        userId: savedUser.id,
        roleId: role.id,
        personaId: 3,
        isDefault: true,
      });

      const savedPersona = await manager.save(UserPersona, userPersona);

      const existingMappings = await manager.find(RoleHasPermission, {
        where: {
          roleId: role.id,
        },
      });
      const uniqueIds = [...new Set(dto.permissionIds)];
      const existingSet = new Set(existingMappings.map((e) => e.permissionId));
      const newMappings = uniqueIds
        .filter((id) => !existingSet.has(id))
        .map((id) =>
          manager.create(RoleHasPermission, {
            roleId: role.id,
            permissionId: id,
          }),
        );
      if (newMappings.length) {
        await manager.save(RoleHasPermission, newMappings);
      }

      // Always fetch only requested permissions
      const assignedPermissions = await manager.find(RoleHasPermission, {
        where: {
          roleId: role.id,
          permissionId: In(uniqueIds),
        },
      });

      this.logger.log(`User created via roles-permission: ${savedUser.email}`);

      return {
        message: 'User created successfully',
        data: {
          user: serialize(UserResponseDto, savedUser),
          userPersona: serialize(UserPersonaResponseDto, savedPersona),
          role: serialize(RoleResponseDto, role),
          assignedPermissions,
        },
      };
    });
  }

  async createUserPersona(
    dto: CreateUserPersonaDto,
  ): Promise<ServiceResponse<UserPersonaResponseDto>> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);

    const persona = this.userPersonaRepo.create({
      userId: dto.userId,
      roleId: dto.roleId,
      personaId: dto.personaId ?? 1,
      isDefault: dto.isDefault ?? true,
    });

    const saved = await this.userPersonaRepo.save(persona);
    this.logger.log(
      `UserPersona created: userId=${dto.userId}, roleId=${dto.roleId}`,
    );

    return {
      message: 'User persona created successfully',
      data: serialize(UserPersonaResponseDto, saved),
    };
  }

  async assignPermissionsToRole(
    dto: AssignPermissionsToRoleDto,
  ): Promise<
    ServiceResponse<{ role: RoleResponseDto; assignedCount: number }>
  > {
    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);

    const existing = await this.rolePermRepo.find({
      where: { roleId: dto.roleId, permissionId: In(dto.permissionIds) },
    });

    const existingIds = new Set(existing.map((e) => e.permissionId));
    const newIds = dto.permissionIds.filter((id) => !existingIds.has(id));

    if (newIds.length === 0) {
      return {
        message: 'All permissions already assigned',
        data: { role: serialize(RoleResponseDto, role), assignedCount: 0 },
      };
    }

    const perms = newIds.map((pid) =>
      this.rolePermRepo.create({ roleId: dto.roleId, permissionId: pid }),
    );

    await this.rolePermRepo.save(perms);
    this.logger.log(
      `Assigned ${newIds.length} permissions to roleId=${dto.roleId}`,
    );

    return {
      message: 'Permissions assigned successfully',
      data: {
        role: serialize(RoleResponseDto, role),
        assignedCount: newIds.length,
      },
    };
  }

  async findUserWithPersonasAndPermissions(
    userId: number,
  ): Promise<ServiceResponse<UserResponseDto>> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'userPersonas',
        'userPersonas.role',
        'userPersonas.role.roleHasPermissions',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return {
      message: 'User fetched successfully',
      data: serialize(UserResponseDto, user),
    };
  }

  async findAllUserPersonas(
    userId: number,
  ): Promise<ServiceResponse<UserPersonaResponseDto[]>> {
    const personas = await this.userPersonaRepo.find({
      where: { userId },
      relations: ['role', 'role.roleHasPermissions'],
    });

    return {
      message: 'User personas fetched successfully',
      data: serialize(UserPersonaResponseDto, personas),
    };
  }
}
