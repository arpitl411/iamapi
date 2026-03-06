import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalcSection } from '../../../../db-schema/calc-section.entity';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalcSection]), PagesModule],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService, TypeOrmModule],
})
export class SectionsModule {}
