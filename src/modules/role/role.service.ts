import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from 'db-schema/role.entity';
import { Permission } from 'db-schema/permission.entity';
import { User } from 'db-schema/user.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<{ message: string; data: Role }> {
    const { permission_ids, user_email, ...roleData } = createRoleDto;

    const existingRole = await this.roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (existingRole) {
      throw new BadRequestException(
        `Role with name '${roleData.name}' already exists`,
      );
    }

    // Create role
    const role = this.roleRepository.create(roleData);

    // If permission IDs are provided, fetch and assign permissions
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

    // Handle user assignment if email is provided
    if (user_email) {
      await this.handleUserRoleAssignment(user_email, savedRole);
    }

    // Return role with permissions
    const roleWithPermissions = await this.roleRepository.findOne({
      where: { id: savedRole.id },
      relations: ['permissions'],
    });

    return {
      message: 'Role created successfully',
      data: roleWithPermissions!,
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
      // User doesn't exist, create new user with default org-admin role
      // Get or find the org-admin default role
      const defaultRole = await this.roleRepository.findOne({
        where: { name: 'org-admin' },
      });

      // Create new user with default values
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
        uuid: this.generateUUID(),
        timezone: new Date(),
        roles: defaultRole ? [defaultRole, role] : [role],
      });

      await this.userRepository.save(newUser);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async getAllRoles(): Promise<{ message: string; data: Role[] }> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });
    return { message: 'Roles fetched successfully', data: roles };
  }

  async getRoleById(id: number): Promise<{ message: string; data: Role }> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return { message: 'Role fetched successfully', data: role };
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string; data: Role }> {
    const { data: role } = await this.getRoleById(id);

    const { permission_ids, ...roleData } = updateRoleDto;

    // Check if updating to a name that already exists (for a different role)
    if (roleData.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(
          `Role with name '${roleData.name}' already exists`,
        );
      }
    }

    // Update basic role data
    Object.assign(role, roleData);

    // If permission IDs are provided, update permissions
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
        // If empty array is provided, remove all permissions
        role.permissions = [];
      }
    }

    const updatedRole = await this.roleRepository.save(role);

    // Return role with updated permissions
    const roleWithPermissions = await this.roleRepository.findOne({
      where: { id: updatedRole.id },
      relations: ['permissions'],
    });

    return {
      message: 'Role updated successfully',
      data: roleWithPermissions!,
    };
  }

  async deleteRole(id: number): Promise<{ message: string; data: null }> {
    const { data: role } = await this.getRoleById(id);
    await this.roleRepository.remove(role);
    return { message: 'Role deleted successfully', data: null };
  }
}
