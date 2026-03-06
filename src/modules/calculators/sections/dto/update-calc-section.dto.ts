import { PartialType } from '@nestjs/swagger';
import { CreateCalcSectionDto } from './create-calc-section.dto';

export class UpdateCalcSectionDto extends PartialType(CreateCalcSectionDto) {}
