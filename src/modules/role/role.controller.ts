import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { PaginationOptions } from 'src/common/interfaces/paginated.interface';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  getAllRoles(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    const pagination: PaginationOptions = { page, limit };
    return this.roleService.getAllRoles(pagination);
  }

  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleById(id);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
