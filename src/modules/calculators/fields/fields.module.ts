import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalcField } from '../../../../db-schema/calc-field.entity';
import { FieldsService } from './fields.service';
import { FieldsController, FieldActionsController } from './fields.controller';
import { SectionsModule } from '../sections/sections.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalcField]), SectionsModule],
  controllers: [FieldsController, FieldActionsController],
  providers: [FieldsService],
  exports: [FieldsService, TypeOrmModule],
})
export class FieldsModule {}
