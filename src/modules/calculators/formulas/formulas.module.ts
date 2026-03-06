import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formula } from '../../../../db-schema/formula.entity';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [TypeOrmModule.forFeature([Formula]), CalculatorsModule],
  controllers: [FormulasController],
  providers: [FormulasService],
  exports: [FormulasService, TypeOrmModule],
})
export class FormulasModule {}
