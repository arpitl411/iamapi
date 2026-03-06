import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalcPublish } from '../../../../db-schema/calc-publish.entity';
import { PublishService } from './publish.service';
import { PublishController, UnpublishController } from './publish.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalcPublish]), CalculatorsModule],
  controllers: [PublishController, UnpublishController],
  providers: [PublishService],
  exports: [PublishService, TypeOrmModule],
})
export class PublishModule {}
