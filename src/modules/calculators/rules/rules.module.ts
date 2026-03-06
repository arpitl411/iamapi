import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '../../../../db-schema/rule.entity';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), CalculatorsModule],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService, TypeOrmModule],
})
export class RulesModule {}
