import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RuleOperator, LogicOperator, RuleActionType, RuleScope } from '../../common/enums';

class RuleConditionDto {
  @ApiProperty({ description: 'Field variable name', example: 'user_age' })
  @IsNotEmpty()
  @IsString()
  field: string;

  @ApiProperty({ description: 'Comparison operator', enum: RuleOperator, example: RuleOperator.GREATER_THAN })
  @IsNotEmpty()
  @IsEnum(RuleOperator)
  operator: RuleOperator;

  @ApiProperty({ description: 'Value to compare against', required: false, example: 18 })
  @IsOptional()
  value?: string | number;

  @ApiProperty({ description: 'Logic operator for next condition', enum: LogicOperator, required: false, default: LogicOperator.AND })
  @IsOptional()
  @IsEnum(LogicOperator)
  logicOperator?: LogicOperator;
}

class RuleActionDto {
  @ApiProperty({ description: 'Type of action', enum: RuleActionType, example: RuleActionType.EXECUTE_FORMULA })
  @IsNotEmpty()
  @IsEnum(RuleActionType)
  type: RuleActionType;

  @ApiProperty({ description: 'Target field/formula/integration', example: 'calculate_premium' })
  @IsNotEmpty()
  @IsString()
  target: string;

  @ApiProperty({ description: 'Value for the action', required: false, example: 'Premium calculated' })
  @IsOptional()
  @IsString()
  value?: string;
}

export class CreateRuleDto {
  @ApiProperty({ description: 'Name of the rule', example: 'Adult Age Validation' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Order position', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ description: 'Array of conditions', type: [RuleConditionDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions: RuleConditionDto[];

  @ApiProperty({ description: 'Array of actions to execute', type: [RuleActionDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleActionDto)
  actions: RuleActionDto[];

  @ApiProperty({ description: 'When to trigger the rule', enum: RuleScope, required: false, default: RuleScope.ON_CHANGE })
  @IsOptional()
  @IsEnum(RuleScope)
  scope?: RuleScope;

  @ApiProperty({ description: 'Whether the rule is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
