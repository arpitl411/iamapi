import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import type { PaginationOptions } from 'src/common/interfaces/paginated.interface';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionService.createPermission(dto);
  }

  @Get()
  getAllPermissions(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    const pagination: PaginationOptions = { page, limit };
    return this.permissionService.getAllPermissions(pagination);
  }

  @Get(':id')
  getPermissionById(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.getPermissionById(id);
  }
}
