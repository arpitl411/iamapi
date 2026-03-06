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
import { PagesService } from './pages.service';
import { CreateCalcPageDto } from './dto/create-calc-page.dto';
import { UpdateCalcPageDto } from './dto/update-calc-page.dto';
import { ReorderDto } from './dto/reorder.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Pages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new page in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 201,
    description: 'Page created successfully',
  })
  async create(
    @Param('calcId') calcId: string,
    @Body() createCalcPageDto: CreateCalcPageDto,
  ) {
    const data = await this.pagesService.create(calcId, createCalcPageDto);
    return {
      success: true,
      data,
      message: 'Page created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all pages in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Pages retrieved successfully',
  })
  async findAll(@Param('calcId') calcId: string) {
    const data = await this.pagesService.findAll(calcId);
    return {
      success: true,
      data,
      message: 'Pages retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single page' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'Page retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.pagesService.findOne(id);
    return {
      success: true,
      data,
      message: 'Page retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a page' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'Page updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCalcPageDto: UpdateCalcPageDto,
  ) {
    const data = await this.pagesService.update(id, updateCalcPageDto);
    return {
      success: true,
      data,
      message: 'Page updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'Page deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.pagesService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Page deleted successfully',
    };
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder pages' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Pages reordered successfully',
  })
  async reorder(
    @Param('calcId') calcId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    await this.pagesService.reorder(calcId, reorderDto.orderedIds);
    return {
      success: true,
      data: null,
      message: 'Pages reordered successfully',
    };
  }
}
