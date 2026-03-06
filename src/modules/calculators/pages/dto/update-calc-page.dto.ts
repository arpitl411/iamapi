import { PartialType } from '@nestjs/swagger';
import { CreateCalcPageDto } from './create-calc-page.dto';

export class UpdateCalcPageDto extends PartialType(CreateCalcPageDto) {}
