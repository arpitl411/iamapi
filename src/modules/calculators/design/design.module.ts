import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculatorDesign } from '../../../../db-schema/calculator-design.entity';
import { DesignService } from './design.service';
import { DesignController } from './design.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatorDesign]), CalculatorsModule],
  controllers: [DesignController],
  providers: [DesignService],
  exports: [DesignService, TypeOrmModule],
})
export class DesignModule {}
