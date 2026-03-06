import { ApiProperty } from '@nestjs/swagger';
import { CalculatorCategory, CalculatorStatus } from '../../common/enums';

export class CalculatorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ enum: CalculatorCategory })
  category: CalculatorCategory;

  @ApiProperty({ enum: CalculatorStatus })
  status: CalculatorStatus;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
