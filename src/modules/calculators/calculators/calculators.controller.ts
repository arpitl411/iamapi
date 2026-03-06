import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CalculatorsService } from './calculators.service';
import { CreateCalculatorDto } from './dto/create-calculator.dto';
import { UpdateCalculatorDto } from './dto/update-calculator.dto';
import { BulkSaveCalculatorDto } from './dto/bulk-save-calculator.dto';
import { BulkUpdateCalculatorDto } from './dto/bulk-update-calculator.dto';
import { CalculatorResponseDto } from './dto/calculator-response.dto';
import { CalculatorStatus } from '../common/enums';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Calculators')
//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('api/v1/organizations/:orgId/calculators')
export class CalculatorsController {
  constructor(private readonly calculatorsService: CalculatorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calculator' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiResponse({
    status: 201,
    description: 'Calculator created successfully',
    type: CalculatorResponseDto,
  })
  async create(
    @Param('orgId') orgId: string,
    @Body() createCalculatorDto: CreateCalculatorDto,
    // TODO: Extract from JWT token
    // @CurrentUser() user: any,
  ) {
    const userId = 'current-user-id'; // Replace with actual user ID from JWT
    const data = await this.calculatorsService.create(
      orgId,
      createCalculatorDto,
      userId,
    );
    return {
      success: true,
      data,
      message: 'Calculator created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all calculators for an organization' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiQuery({ name: 'status', enum: CalculatorStatus, required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'Calculators retrieved successfully',
    type: [CalculatorResponseDto],
  })
  async findAll(
    @Param('orgId') orgId: string,
    @Query('status') status?: CalculatorStatus,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.calculatorsService.findAll(orgId, {
      status,
      category,
      search,
    });
    return {
      success: true,
      data,
      message: 'Calculators retrieved successfully',
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get calculator statistics for an organization' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats(@Param('orgId') orgId: string) {
    const data = await this.calculatorsService.getStats(orgId);
    return {
      success: true,
      data,
      message: 'Statistics retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single calculator with full details' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'id', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator retrieved successfully',
    type: CalculatorResponseDto,
  })
  async findOne(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.calculatorsService.findOne(id, orgId);
    return {
      success: true,
      data,
      message: 'Calculator retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update calculator metadata' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'id', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator updated successfully',
    type: CalculatorResponseDto,
  })
  async update(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() updateCalculatorDto: UpdateCalculatorDto,
  ) {
    const data = await this.calculatorsService.update(
      id,
      orgId,
      updateCalculatorDto,
    );
    return {
      success: true,
      data,
      message: 'Calculator updated successfully',
    };
  }

  @Post('bulk')
  @ApiOperation({
    summary:
      'Create calculator with all components (pages, sections, fields, formulas, rules, integrations, design) in one request',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiResponse({
    status: 201,
    description: 'Calculator created with all components successfully',
    type: CalculatorResponseDto,
  })
  async bulkCreate(
    @Param('orgId') orgId: string,
    @Body() bulkSaveDto: BulkSaveCalculatorDto,
  ) {
    const userId = 'current-user-id'; // Replace with actual user ID from JWT
    const data = await this.calculatorsService.bulkSaveDraft(
      orgId,
      bulkSaveDto,
      userId,
    );
    return {
      success: true,
      data,
      message: 'Calculator saved as draft successfully',
    };
  }

  @Put(':id/bulk')
  @ApiOperation({
    summary:
      'Update calculator with all components (pages, sections, fields, formulas, rules, integrations, design) in one request',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'id', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator updated with all components successfully',
    type: CalculatorResponseDto,
  })
  async bulkUpdate(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() bulkUpdateDto: BulkUpdateCalculatorDto,
  ) {
    const data = await this.calculatorsService.bulkUpdateDraft(
      id,
      orgId,
      bulkUpdateDto,
    );
    return {
      success: true,
      data,
      message: 'Calculator draft updated successfully',
    };
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Validate and publish calculator with all its components',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'id', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator published successfully',
    type: CalculatorResponseDto,
  })
  async bulkPublish(@Param('orgId') orgId: string, @Param('id') id: string) {
    const userId = 'current-user-id'; // Replace with actual user ID from JWT
    const data = await this.calculatorsService.bulkPublish(id, orgId, userId);
    return {
      success: true,
      data,
      message: 'Calculator published successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive a calculator' })
  @ApiParam({ name: 'orgId', description: 'Organization ID' })
  @ApiParam({ name: 'id', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator archived successfully',
  })
  async remove(@Param('orgId') orgId: string, @Param('id') id: string) {
    await this.calculatorsService.remove(id, orgId);
    return {
      success: true,
      data: null,
      message: 'Calculator archived successfully',
    };
  }
}
