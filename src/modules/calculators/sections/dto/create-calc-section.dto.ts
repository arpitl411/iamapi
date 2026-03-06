import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCalcSectionDto {
  @ApiProperty({ description: 'Name of the section', example: 'Basic Details' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Order position', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ description: 'Number of columns (1-3)', required: false, default: 1, minimum: 1, maximum: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  columns?: number;
}
