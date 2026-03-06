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
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { ReorderDto } from '../pages/dto/reorder.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rule in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 201,
    description: 'Rule created successfully',
  })
  async create(
    @Param('calcId') calcId: string,
    @Body() createRuleDto: CreateRuleDto,
  ) {
    const data = await this.rulesService.create(calcId, createRuleDto);
    return {
      success: true,
      data,
      message: 'Rule created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all rules in a calculator (ordered)' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Rules retrieved successfully',
  })
  async findAll(@Param('calcId') calcId: string) {
    const data = await this.rulesService.findAll(calcId);
    return {
      success: true,
      data,
      message: 'Rules retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single rule' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({
    status: 200,
    description: 'Rule retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.rulesService.findOne(id);
    return {
      success: true,
      data,
      message: 'Rule retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({
    status: 200,
    description: 'Rule updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    const data = await this.rulesService.update(id, updateRuleDto);
    return {
      success: true,
      data,
      message: 'Rule updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({
    status: 200,
    description: 'Rule deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.rulesService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Rule deleted successfully',
    };
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder rules' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Rules reordered successfully',
  })
  async reorder(
    @Param('calcId') calcId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    await this.rulesService.reorder(calcId, reorderDto.orderedIds);
    return {
      success: true,
      data: null,
      message: 'Rules reordered successfully',
    };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle rule active status' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({
    status: 200,
    description: 'Rule toggled successfully',
  })
  async toggle(@Param('id') id: string) {
    const data = await this.rulesService.toggle(id);
    return {
      success: true,
      data,
      message: 'Rule toggled successfully',
    };
  }
}
