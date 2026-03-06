import { PartialType } from '@nestjs/swagger';
import { CreateCalcFieldDto } from './create-calc-field.dto';

export class UpdateCalcFieldDto extends PartialType(CreateCalcFieldDto) {}
