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
import { CategoryQueryDto } from './dtos/category-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationOptions } from 'src/common/interfaces/paginated.interface';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('status-types')
  @UseGuards(JwtAuthGuard)
  getStatusTypes() {
    return this.categoryService.getCategoryStatusTypes();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.categoryService.getCategoryStats();
  }

  @Get('tree')
  @UseGuards(JwtAuthGuard)
  getTree() {
    return this.categoryService.getCategoryTree();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query() query: CategoryQueryDto,
  ) {
    const pagination: PaginationOptions = { page, limit };
    return this.categoryService.getAllCategories(pagination, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateCategoryDto>,
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}