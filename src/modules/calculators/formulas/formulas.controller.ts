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
import { FormulasService } from './formulas.service';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Formulas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new formula in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 201,
    description: 'Formula created successfully',
  })
  async create(
    @Param('calcId') calcId: string,
    @Body() createFormulaDto: CreateFormulaDto,
  ) {
    const data = await this.formulasService.create(calcId, createFormulaDto);
    return {
      success: true,
      data,
      message: 'Formula created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all formulas in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Formulas retrieved successfully',
  })
  async findAll(@Param('calcId') calcId: string) {
    const data = await this.formulasService.findAll(calcId);
    return {
      success: true,
      data,
      message: 'Formulas retrieved successfully',
    };
  }

  @Get('variables')
  @ApiOperation({ summary: 'Get all formula output variables for dropdowns' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Variables retrieved successfully',
    type: [String],
  })
  async getVariables(@Param('calcId') calcId: string) {
    const data = await this.formulasService.getVariables(calcId);
    return {
      success: true,
      data,
      message: 'Variables retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single formula' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Formula ID' })
  @ApiResponse({
    status: 200,
    description: 'Formula retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.formulasService.findOne(id);
    return {
      success: true,
      data,
      message: 'Formula retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a formula' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Formula ID' })
  @ApiResponse({
    status: 200,
    description: 'Formula updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFormulaDto: UpdateFormulaDto,
  ) {
    const data = await this.formulasService.update(id, updateFormulaDto);
    return {
      success: true,
      data,
      message: 'Formula updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a formula' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Formula ID' })
  @ApiResponse({
    status: 200,
    description: 'Formula deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.formulasService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Formula deleted successfully',
    };
  }
}
