import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Integration } from '../../../../db-schema/integration.entity';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Integration]),
    CalculatorsModule,
    HttpModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService, TypeOrmModule],
})
export class IntegrationsModule {}
