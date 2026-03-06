import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormulaType } from '../../common/enums';

class FormulaStepDto {
  @ApiProperty({ description: 'First operand (variable name or number)', example: 'coverage_amount' })
  @IsNotEmpty()
  @IsString()
  operand1: string;

  @ApiProperty({ description: 'Operator', enum: ['+', '-', '*', '/'], example: '*' })
  @IsNotEmpty()
  @IsString()
  operator: '+' | '-' | '*' | '/';

  @ApiProperty({ description: 'Second operand (variable name or number)', example: 'rate' })
  @IsNotEmpty()
  @IsString()
  operand2: string;

  @ApiProperty({ description: 'Static value if operand is a constant', required: false, example: 0.05 })
  @IsOptional()
  staticValue?: number;
}

export class CreateFormulaDto {
  @ApiProperty({ description: 'Name of the formula', example: 'Calculate Monthly Premium' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Output variable name (snake_case)', 
    example: 'monthly_premium',
    pattern: '^[a-z][a-z0-9_]*$'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message: 'outputVariable must be in snake_case format',
  })
  outputVariable: string;

  @ApiProperty({ description: 'Type of formula', enum: FormulaType, example: FormulaType.STEP })
  @IsNotEmpty()
  @IsEnum(FormulaType)
  type: FormulaType;

  @ApiProperty({ 
    description: 'Steps for step-by-step formula', 
    type: [FormulaStepDto], 
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaStepDto)
  @ValidateIf((o) => o.type === FormulaType.STEP)
  steps?: FormulaStepDto[];

  @ApiProperty({ 
    description: 'Expression for advanced formula', 
    required: false,
    example: '(sqrt({{age}}) * {{coverage_amount}}) / 100'
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.type === FormulaType.ADVANCED)
  expression?: string;
}
