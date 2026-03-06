import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dtos/create-blog-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Blog Categories')
@ApiBearerAuth()
@Controller({ path: 'blog-categories', version: '1' })
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Blog category created successfully' })
  create(@Body() dto: CreateBlogCategoryDto) { return this.blogCategoryService.create(dto); }

  @Get()    
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Blog categories retrieved successfully' })
  findAll(@Query('blogId', new ParseIntPipe({ optional: true })) blogId?: number, @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number) { return this.blogCategoryService.findAll(blogId, categoryId); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Blog category retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.blogCategoryService.findOne(id); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Blog category deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.blogCategoryService.remove(id); }

  @Delete('blog/:blogId/category/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Blog category deleted successfully' })
  removeByBlogAndCategory(@Param('blogId', ParseIntPipe) blogId: number, @Param('categoryId', ParseIntPipe) categoryId: number) { return this.blogCategoryService.removeByBlogAndCategory(blogId, categoryId); }
}

