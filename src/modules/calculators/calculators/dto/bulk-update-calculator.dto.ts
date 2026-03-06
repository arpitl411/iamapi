import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CalculatorCategory } from '../../common/enums';
import { UpdateCalcFieldDto } from '../../fields/dto/update-calc-field.dto';
import { UpdateCalcSectionDto } from '../../sections/dto/update-calc-section.dto';
import { UpdateCalcPageDto } from '../../pages/dto/update-calc-page.dto';
import { UpdateFormulaDto } from '../../formulas/dto/update-formula.dto';
import { UpdateRuleDto } from '../../rules/dto/update-rule.dto';
import { UpdateIntegrationDto } from '../../integrations/dto/update-integration.dto';
import { UpsertDesignDto } from '../../design/dto/upsert-design.dto';

export class BulkUpdateFieldDto extends UpdateCalcFieldDto {
  @ApiProperty({ description: 'Field ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Temporary ID for new fields', required: false })
  @IsOptional()
  @IsString()
  tempId?: string;
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdateSectionDto extends UpdateCalcSectionDto {
  @ApiProperty({ description: 'Section ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Fields in this section', type: [BulkUpdateFieldDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateFieldDto)
  fields?: BulkUpdateFieldDto[];
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdatePageDto extends UpdateCalcPageDto {
  @ApiProperty({ description: 'Page ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Sections in this page', type: [BulkUpdateSectionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateSectionDto)
  sections?: BulkUpdateSectionDto[];
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdateFormulaDto extends UpdateFormulaDto {
  @ApiProperty({ description: 'Formula ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdateRuleDto extends UpdateRuleDto {
  @ApiProperty({ description: 'Rule ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdateIntegrationDto extends UpdateIntegrationDto {
  @ApiProperty({ description: 'Integration ID (if updating existing)', required: false })
  @IsOptional()
  @IsString()
  id?: string;
  
  @ApiProperty({ description: 'Mark for deletion', required: false })
  @IsOptional()
  _delete?: boolean;
}

export class BulkUpdateCalculatorDto {
  @ApiProperty({
    description: 'Name of the calculator',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Description of the calculator',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Category of the calculator',
    enum: CalculatorCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalculatorCategory)
  category?: CalculatorCategory;

  @ApiProperty({
    description: 'Pages in the calculator (with id for update, without for create)',
    type: [BulkUpdatePageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdatePageDto)
  pages?: BulkUpdatePageDto[];

  @ApiProperty({
    description: 'Formulas in the calculator',
    type: [BulkUpdateFormulaDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateFormulaDto)
  formulas?: BulkUpdateFormulaDto[];

  @ApiProperty({
    description: 'Rules in the calculator',
    type: [BulkUpdateRuleDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateRuleDto)
  rules?: BulkUpdateRuleDto[];

  @ApiProperty({
    description: 'Integrations in the calculator',
    type: [BulkUpdateIntegrationDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateIntegrationDto)
  integrations?: BulkUpdateIntegrationDto[];

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
