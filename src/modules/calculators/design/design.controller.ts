import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DesignService } from './design.service';
import { UpsertDesignDto } from './dto/upsert-design.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Design')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/design')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Get()
  @ApiOperation({
    summary: 'Get design settings (creates defaults if not exist)',
  })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Design settings retrieved successfully',
  })
  async get(@Param('calcId') calcId: string) {
    const data = await this.designService.get(calcId);
    return {
      success: true,
      data,
      message: 'Design settings retrieved successfully',
    };
  }

  @Put()
  @ApiOperation({ summary: 'Upsert design settings' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Design settings saved successfully',
  })
  async upsert(
    @Param('calcId') calcId: string,
    @Body() upsertDesignDto: UpsertDesignDto,
  ) {
    const data = await this.designService.upsert(calcId, upsertDesignDto);
    return {
      success: true,
      data,
      message: 'Design settings saved successfully',
    };
  }
}
