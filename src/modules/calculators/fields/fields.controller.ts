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
import { FieldsService } from './fields.service';
import { CreateCalcFieldDto } from './dto/create-calc-field.dto';
import { UpdateCalcFieldDto } from './dto/update-calc-field.dto';
import { ReorderDto } from '../pages/dto/reorder.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/sections/:sectionId/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field in a section' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: 201,
    description: 'Field created successfully',
  })
  async create(
    @Param('sectionId') sectionId: string,
    @Body() createCalcFieldDto: CreateCalcFieldDto,
  ) {
    const data = await this.fieldsService.create(sectionId, createCalcFieldDto);
    return {
      success: true,
      data,
      message: 'Field created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all fields in a section' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: 200,
    description: 'Fields retrieved successfully',
  })
  async findAll(@Param('sectionId') sectionId: string) {
    const data = await this.fieldsService.findAll(sectionId);
    return {
      success: true,
      data,
      message: 'Fields retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single field' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.fieldsService.findOne(id);
    return {
      success: true,
      data,
      message: 'Field retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a field' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCalcFieldDto: UpdateCalcFieldDto,
  ) {
    const data = await this.fieldsService.update(id, updateCalcFieldDto);
    return {
      success: true,
      data,
      message: 'Field updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.fieldsService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Field deleted successfully',
    };
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder fields' })
  @ApiParam({ name: 'sectionId', description: 'Section ID' })
  @ApiResponse({
    status: 200,
    description: 'Fields reordered successfully',
  })
  async reorder(
    @Param('sectionId') sectionId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    await this.fieldsService.reorder(sectionId, reorderDto.orderedIds);
    return {
      success: true,
      data: null,
      message: 'Fields reordered successfully',
    };
  }
}

@ApiTags('Fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/fields')
export class FieldActionsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a field' })
  @ApiParam({ name: 'id', description: 'Field ID to duplicate' })
  @ApiResponse({
    status: 201,
    description: 'Field duplicated successfully',
  })
  async duplicate(@Param('id') id: string) {
    const data = await this.fieldsService.duplicate(id);
    return {
      success: true,
      data,
      message: 'Field duplicated successfully',
    };
  }
}
