import {
  Controller,
  Get,
  Post,
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
import { PublishService } from './publish.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Publish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Get()
  @ApiOperation({ summary: 'Get publish status and embed information' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Publish status retrieved successfully',
  })
  async getStatus(@Param('calcId') calcId: string) {
    const data = await this.publishService.getPublishStatus(calcId);
    return {
      success: true,
      data,
      message: 'Publish status retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({
    summary:
      'Publish the calculator (validates, sets live, generates embed code)',
  })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator published successfully',
  })
  async publish(@Param('calcId') calcId: string) {
    const userId = 'current-user-id'; // Replace with actual user ID from JWT
    const data = await this.publishService.publish(calcId, userId);
    return {
      success: true,
      data,
      message: 'Calculator published successfully',
    };
  }

  @Get('embed')
  @ApiOperation({ summary: 'Get embed code and configuration' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Embed information retrieved successfully',
  })
  async getEmbed(@Param('calcId') calcId: string) {
    const data = await this.publishService.getEmbedInfo(calcId);
    return {
      success: true,
      data,
      message: 'Embed information retrieved successfully',
    };
  }
}

@ApiTags('Publish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calculators/:calcId/unpublish')
export class UnpublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post()
  @ApiOperation({ summary: 'Unpublish the calculator (set to draft)' })
  @ApiParam({ name: 'calcId', description: 'Calculator ID' })
  @ApiResponse({
    status: 200,
    description: 'Calculator unpublished successfully',
  })
  async unpublish(@Param('calcId') calcId: string) {
    await this.publishService.unpublish(calcId);
    return {
      success: true,
      data: null,
      message: 'Calculator unpublished successfully',
    };
  }
}
