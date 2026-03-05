import {
  ConflictException,
  Injectable,
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
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DataSource, In, Repository } from 'typeorm';
import { Permission } from 'db-schema/permission.entity';

@Injectable()
export class RolesPermissionService {
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

  async createUser(dto: CreateUserDto) {
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
      const hashedPassword = await bcrypt.hash(dto.password, 10);

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

      return {
        user: this.sanitizeUser(savedUser),
        userPersona: savedPersona,
        role,
        assignedPermissions: assignedPermissions,
      };
    });
  }

  async createUserPersona(dto: CreateUserPersonaDto) {
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

    return this.userPersonaRepo.save(persona);
  }

  async assignPermissionsToRole(dto: AssignPermissionsToRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);

    const existing = await this.rolePermRepo.find({
      where: { roleId: dto.roleId, permissionId: In(dto.permissionIds) },
    });

    const existingIds = new Set(existing.map((e) => e.permissionId));
    const newIds = dto.permissionIds.filter((id) => !existingIds.has(id));

    if (newIds.length === 0) {
      return { message: 'All permissions already assigned', role };
    }

    const perms = newIds.map((pid) =>
      this.rolePermRepo.create({ roleId: dto.roleId, permissionId: pid }),
    );

    const saved = await this.rolePermRepo.save(perms);
    return { role, assignedPermissions: saved };
  }

  async findUserWithPersonasAndPermissions(userId: number) {
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

    return this.sanitizeUser(user);
  }

  async findAllUserPersonas(userId: number) {
    return this.userPersonaRepo.find({
      where: { userId },
      relations: ['role', 'role.roleHasPermissions'],
    });
  }

  private sanitizeUser(user: User) {
    const { password, rememberToken, tsv, ...safe } = user as any;
    return safe;
  }
}
