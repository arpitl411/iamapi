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
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new integration in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 201,
    description: 'Integration created successfully',
  })
  async create(
    @Param('calcId') calcId: string,
    @Body() createIntegrationDto: CreateIntegrationDto,
  ) {
    const data = await this.integrationsService.create(
      calcId,
      createIntegrationDto,
    );
    return {
      success: true,
      data,
      message: 'Integration created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all integrations in a calculator' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Integrations retrieved successfully',
  })
  async findAll(@Param('calcId') calcId: string) {
    const data = await this.integrationsService.findAll(calcId);
    return {
      success: true,
      data,
      message: 'Integrations retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single integration' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const data = await this.integrationsService.findOne(id);
    return {
      success: true,
      data,
      message: 'Integration retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an integration' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
  ) {
    const data = await this.integrationsService.update(
      id,
      updateIntegrationDto,
    );
    return {
      success: true,
      data,
      message: 'Integration updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an integration' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.integrationsService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Integration deleted successfully',
    };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle integration active status' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration toggled successfully',
  })
  async toggle(@Param('id') id: string) {
    const data = await this.integrationsService.toggle(id);
    return {
      success: true,
      data,
      message: 'Integration toggled successfully',
    };
  }

  @Post(':id/test')
  @ApiOperation({
    summary: 'Test fire the integration with mock data (dry run)',
  })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration test completed',
  })
  async test(@Param('id') id: string) {
    const data = await this.integrationsService.test(id);
    return {
      success: true,
      data,
      message: 'Integration test completed',
    };
  }
}
