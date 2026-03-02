import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Role } from 'db-schema/role.entity';
import { AssignPermissionsToRoleDto } from '../roles-permission/dtos/create-user.dto';
import { RolesPermissionService } from '../roles-permission/roles-permission.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService,
    // private rolesPermissionService: RolesPermissionService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<{ message: string; role: Role }> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string; role: Role }> {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.roleService.deleteRole(id);
  }

  // @Post('permissions')
  // @HttpCode(HttpStatus.CREATED)
  // async assignPermissions(@Body() dto: AssignPermissionsToRoleDto) {
  //   return this.rolesPermissionService.assignPermissionsToRole(dto);
  // }
}
