import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCalcPageDto {
  @ApiProperty({ description: 'Title of the page', example: 'Personal Information' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Order position', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ description: 'Whether this is a result page', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isResultPage?: boolean;
}
