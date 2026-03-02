import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from 'db-schema/permission.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }

  @Get(':id')
  async getPermissionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Permission> {
    return this.permissionService.getPermissionById(id);
  }
}
