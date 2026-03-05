import {
  Body,
  Controller,
  Delete,
  Get,
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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PaginationDto } from './dtos/pagination.dto';
import { Tag } from 'db-schema/tag.entity';

@Controller('user-tag')
export class UserTagController {
  constructor(private userTagService: UserTagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateUserTagDto) {
    const data = await this.userTagService.create(dto);

    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get('get-user-tag')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: PaginationDto) {
    return this.userTagService.getAllUserTag(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUserTag(
    @Param('id') id: number,
    @Body() body: Partial<Tag>,
  ) {
    return this.userTagService.updateUserTag(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.userTagService.deleteUserTag(id);
  }
}
