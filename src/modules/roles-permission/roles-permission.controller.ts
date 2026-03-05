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
import { CreateUserDto, CreateUserPersonaDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('roles-permission')
@UseGuards(JwtAuthGuard)
export class RolesPermissionController {
  constructor(
    private readonly rolesPermissionService: RolesPermissionService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return this.rolesPermissionService.createUser(dto);
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.rolesPermissionService.findUserWithPersonasAndPermissions(
      id,
    );
  }
  @Post('persona')
  @HttpCode(HttpStatus.CREATED)
  async createUserPersona(@Body() dto: CreateUserPersonaDto) {
    return this.rolesPermissionService.createUserPersona(dto);
  }
  @Get(':id/personas')
  @UseGuards(JwtAuthGuard)
  async getUserPersonas(@Param('id', ParseIntPipe) id: number) {
    return this.rolesPermissionService.findAllUserPersonas(id);
  }
}
