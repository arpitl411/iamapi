import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalcPage } from '../../../../db-schema/calc-page.entity';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { CalculatorsModule } from '../calculators/calculators.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalcPage]), CalculatorsModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService, TypeOrmModule],
})
export class PagesModule {}
