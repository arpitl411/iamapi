import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserTagDto } from './dtos/create-user-tag.dto';
import { UserTagService } from './user-tag.service';
import { PaginationDto } from './dtos/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';

@Controller('user-tag')
export class UserTagController {
  constructor(private userTagService: UserTagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserTagDto) {
    return this.userTagService.createUserTag(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query() query: PaginationDto,
  ) {
    const pagination: PaginationOptions = { page, limit };

    return this.userTagService.getAllUserTag(pagination, query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUserTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserTagDto: CreateUserTagDto
  ) {
    return this.userTagService.updateUserTag(id, updateUserTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.userTagService.deleteUserTag(id);
  }
}
