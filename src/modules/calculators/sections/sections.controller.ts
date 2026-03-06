import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateCalcSectionDto } from './dto/create-calc-section.dto';
import { UpdateCalcSectionDto } from './dto/update-calc-section.dto';
import { ReorderDto } from '../pages/dto/reorder.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Sections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/pages/:pageId/sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new section in a page' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiResponse({
    status: 201,
    description: 'Section created successfully',
  })
  async create(
    @Param('pageId') pageId: string,
    @Body() createCalcSectionDto: CreateCalcSectionDto,
  ) {
    const data = await this.sectionsService.create(pageId, createCalcSectionDto);
    return {
      success: true,
      data,
      message: 'Section created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all sections in a page' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'Sections retrieved successfully',
  })
  async findAll(@Param('pageId') pageId: string) {
    const data = await this.sectionsService.findAll(pageId);
    return {
      success: true,
      data,
      message: 'Sections retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single section' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: 200,
    description: 'Section retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.sectionsService.findOne(id);
    return {
      success: true,
      data,
      message: 'Section retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a section' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: 200,
    description: 'Section updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCalcSectionDto: UpdateCalcSectionDto,
  ) {
    const data = await this.sectionsService.update(id, updateCalcSectionDto);
    return {
      success: true,
      data,
      message: 'Section updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a section' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({
    status: 200,
    description: 'Section deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.sectionsService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Section deleted successfully',
    };
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder sections' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'Sections reordered successfully',
  })
  async reorder(
    @Param('pageId') pageId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    await this.sectionsService.reorder(pageId, reorderDto.orderedIds);
    return {
      success: true,
      data: null,
      message: 'Sections reordered successfully',
    };
  }
}
