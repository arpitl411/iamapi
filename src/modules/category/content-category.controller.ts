import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentCategoryService } from './content-category.service';
import { CreateContentCategoryDto } from './dtos/create-content-category.dto';
import { UpdateContentCategoryDto } from './dtos/update-content-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Content Categories')
@ApiBearerAuth()
@Controller({ path: 'content-categories', version: '1' })
export class ContentCategoryController {
  constructor(private readonly contentCategoryService: ContentCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Content category created successfully' })
  create(@Body() dto: CreateContentCategoryDto) { return this.contentCategoryService.create(dto); }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content categories retrieved successfully' })
  findAll(@Query('search') search?: string, @Query('status') status?: string) { return this.contentCategoryService.findAll(search, status); }

  @Get('slug/:slug')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content category retrieved successfully' })
  findBySlug(@Param('slug') slug: string) { return this.contentCategoryService.findBySlug(slug); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content category retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.contentCategoryService.findOne(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content category updated successfully' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContentCategoryDto) { return this.contentCategoryService.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content category deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.contentCategoryService.remove(id); }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Content category restored successfully' })
  restore(@Param('id', ParseIntPipe) id: number) { return this.contentCategoryService.restore(id); }
}
