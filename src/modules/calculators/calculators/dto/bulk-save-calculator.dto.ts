import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CalculatorCategory } from '../../common/enums';
import { CreateCalcFieldDto } from '../../fields/dto/create-calc-field.dto';
import { CreateCalcSectionDto } from '../../sections/dto/create-calc-section.dto';
import { CreateCalcPageDto } from '../../pages/dto/create-calc-page.dto';
import { CreateFormulaDto } from '../../formulas/dto/create-formula.dto';
import { CreateRuleDto } from '../../rules/dto/create-rule.dto';
import { CreateIntegrationDto } from '../../integrations/dto/create-integration.dto';
import { UpsertDesignDto } from '../../design/dto/upsert-design.dto';

export class BulkCalcFieldDto extends CreateCalcFieldDto {
  @ApiProperty({ description: 'Temporary ID for cross-referencing in formulas/rules', required: false })
  @IsOptional()
  @IsString()
  tempId?: string;
}

export class BulkCalcSectionDto extends CreateCalcSectionDto {
  @ApiProperty({ description: 'Fields in this section', type: [BulkCalcFieldDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkCalcFieldDto)
  fields?: BulkCalcFieldDto[];
}

export class BulkCalcPageDto extends CreateCalcPageDto {
  @ApiProperty({ description: 'Sections in this page', type: [BulkCalcSectionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkCalcSectionDto)
  sections?: BulkCalcSectionDto[];
}

export class BulkSaveCalculatorDto {
  @ApiProperty({
    description: 'Name of the calculator',
    minLength: 2,
    maxLength: 100,
    example: 'Insurance Premium Calculator',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the calculator',
    required: false,
    maxLength: 500,
    example: 'Calculate your monthly insurance premium based on coverage and age',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Category of the calculator',
    enum: CalculatorCategory,
    example: CalculatorCategory.INSURANCE,
  })
  @IsNotEmpty()
  @IsEnum(CalculatorCategory)
  category: CalculatorCategory;

  @ApiProperty({
    description: 'Pages in the calculator',
    type: [BulkCalcPageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkCalcPageDto)
  pages?: BulkCalcPageDto[];

  @ApiProperty({
    description: 'Formulas in the calculator',
    type: [CreateFormulaDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormulaDto)
  formulas?: CreateFormulaDto[];

  @ApiProperty({
    description: 'Rules in the calculator',
    type: [CreateRuleDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRuleDto)
  rules?: CreateRuleDto[];

  @ApiProperty({
    description: 'Integrations in the calculator',
    type: [CreateIntegrationDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIntegrationDto)
  integrations?: CreateIntegrationDto[];

  @ApiProperty({
    description: 'Design settings for the calculator',
    type: UpsertDesignDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpsertDesignDto)
  design?: UpsertDesignDto;
}
