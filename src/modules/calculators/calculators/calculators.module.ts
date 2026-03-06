import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calculator } from '../../../../db-schema/calculator.entity';
import { CalcPage } from '../../../../db-schema/calc-page.entity';
import { CalcSection } from '../../../../db-schema/calc-section.entity';
import { CalcField } from '../../../../db-schema/calc-field.entity';
import { Formula } from '../../../../db-schema/formula.entity';
import { Rule } from '../../../../db-schema/rule.entity';
import { Integration } from '../../../../db-schema/integration.entity';
import { CalculatorDesign } from '../../../../db-schema/calculator-design.entity';
import { CalcPublish } from '../../../../db-schema/calc-publish.entity';
import { CalculatorsService } from './calculators.service';
import { CalculatorsController } from './calculators.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Calculator,
      CalcPage,
      CalcSection,
      CalcField,
      Formula,
      Rule,
      Integration,
      CalculatorDesign,
      CalcPublish,
    ]),
  ],
  controllers: [CalculatorsController],
  providers: [CalculatorsService],
  exports: [CalculatorsService, TypeOrmModule],
})
export class CalculatorsModule {}
