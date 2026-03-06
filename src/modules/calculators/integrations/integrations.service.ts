import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration } from '../../../../db-schema/integration.entity';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { Calculator } from '../../../../db-schema/calculator.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private integrationRepository: Repository<Integration>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    private httpService: HttpService,
  ) {}

  async create(
    calculatorId: string,
    createDto: CreateIntegrationDto,
  ): Promise<Integration> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    const integration = this.integrationRepository.create({
      ...createDto,
      calculatorId,
    });

    return this.integrationRepository.save(integration);
  }

  async findAll(calculatorId: string): Promise<Integration[]> {
    return this.integrationRepository.find({
      where: { calculatorId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Integration> {
    const integration = await this.integrationRepository.findOne({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    return integration;
  }

  async update(
    id: string,
    updateDto: UpdateIntegrationDto,
  ): Promise<Integration> {
    const integration = await this.findOne(id);

    Object.assign(integration, updateDto);

    return this.integrationRepository.save(integration);
  }

  async remove(id: string): Promise<void> {
    const integration = await this.findOne(id);
    await this.integrationRepository.remove(integration);
  }

  async toggle(id: string): Promise<Integration> {
    const integration = await this.findOne(id);

    integration.isActive = !integration.isActive;

    return this.integrationRepository.save(integration);
  }

  async test(
    id: string,
  ): Promise<{ success: boolean; statusCode: number; response: any }> {
    const integration = await this.findOne(id);

    // Create mock payload for testing
    const mockPayload: Record<string, any> = {};
    if (integration.payloadMapping) {
      Object.keys(integration.payloadMapping).forEach((key) => {
        mockPayload[integration.payloadMapping[key]] = `mock_${key}`;
      });
    }

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: integration.method,
          url: integration.url,
          headers: integration.headers || {},
          data:
            integration.method !== 'GET' ? mockPayload : undefined,
          params: integration.method === 'GET' ? mockPayload : undefined,
        }),
      );

      return {
        success: true,
        statusCode: response.status,
        response: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        statusCode: axiosError.response?.status || 500,
        response: axiosError.response?.data || axiosError.message,
      };
    }
  }
}
