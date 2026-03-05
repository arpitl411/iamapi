import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RolesPermissionService } from './roles-permission.service';
import {
  AssignPermissionsToRoleDto,
  CreateUserDto,
  CreateUserPersonaDto,
} from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('roles-permission')
@UseGuards(JwtAuthGuard)
export class RolesPermissionController {
  constructor(
    private readonly rolesPermissionService: RolesPermissionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() dto: CreateUserDto) {
    return this.rolesPermissionService.createUser(dto);
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.rolesPermissionService.findUserWithPersonasAndPermissions(id);
  }

  @Get(':id/personas')
  getUserPersonas(@Param('id', ParseIntPipe) id: number) {
    return this.rolesPermissionService.findAllUserPersonas(id);
  }

  @Post('persona')
  @HttpCode(HttpStatus.CREATED)
  createUserPersona(@Body() dto: CreateUserPersonaDto) {
    return this.rolesPermissionService.createUserPersona(dto);
  }

  @Post('assign-permissions')
  @HttpCode(HttpStatus.OK)
  assignPermissionsToRole(@Body() dto: AssignPermissionsToRoleDto) {
    return this.rolesPermissionService.assignPermissionsToRole(dto);
  }
}
