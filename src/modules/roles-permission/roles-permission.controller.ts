import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesPermissionService } from './roles-permission.service';
import { CreateUserDto, CreateUserPersonaDto } from './dtos/create-user.dto';


@Controller('roles-permission')
export class RolesPermissionController {
    constructor(private readonly rolesPermissionService: RolesPermissionService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return this.rolesPermissionService.createUser(dto);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /users/:id
  // Fetch user with personas + role + permissions
  // ──────────────────────────────────────────────────────────────────────────
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.rolesPermissionService.findUserWithPersonasAndPermissions(id);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // POST /users/persona
  // Standalone: create a user_persona record
  // ──────────────────────────────────────────────────────────────────────────
  @Post('persona')
  @HttpCode(HttpStatus.CREATED)
  async createUserPersona(@Body() dto: CreateUserPersonaDto) {
    return this.rolesPermissionService.createUserPersona(dto);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /users/:id/personas
  // List all personas for a user
  // ──────────────────────────────────────────────────────────────────────────
  @Get(':id/personas')
  async getUserPersonas(@Param('id', ParseIntPipe) id: number) {
    return this.rolesPermissionService.findAllUserPersonas(id);
  }
}
