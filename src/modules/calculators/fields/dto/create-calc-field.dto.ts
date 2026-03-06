import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { FieldType, ResultFormat, ChartType } from '../../common/enums';

export class CreateCalcFieldDto {
  @ApiProperty({ description: 'Type of field', enum: FieldType, example: FieldType.NUMBER })
  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ description: 'Label for the field', example: 'Age' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ 
    description: 'Variable name (snake_case only)', 
    example: 'user_age',
    pattern: '^[a-z][a-z0-9_]*$'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message: 'variableName must be in snake_case format (lowercase letters, numbers, underscores only, must start with a letter)',
  })
  variableName: string;

  @ApiProperty({ description: 'Placeholder text', required: false, example: 'Enter your age' })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiProperty({ description: 'Whether field is required', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiProperty({ description: 'Order position', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ 
    description: 'Options for dropdown/radio/checkbox', 
    required: false, 
    type: [String],
    example: ['Option 1', 'Option 2', 'Option 3']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => [FieldType.DROPDOWN, FieldType.RADIO, FieldType.CHECKBOX].includes(o.type))
  options?: string[];

  @ApiProperty({ description: 'Minimum value (for number/slider)', required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiProperty({ description: 'Maximum value (for number/slider)', required: false, example: 100 })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiProperty({ description: 'Step value (for slider)', required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  step?: number;

  @ApiProperty({ description: 'Default value', required: false, example: '25' })
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiProperty({ description: 'Help text', required: false, example: 'Please enter your current age' })
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiProperty({ description: 'Prefix (e.g., currency symbol)', required: false, example: '₹' })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({ description: 'Suffix (e.g., unit)', required: false, example: 'years' })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiProperty({ 
    description: 'Variable to bind (for result_card)', 
    required: false, 
    example: 'calculated_premium'
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.type === FieldType.RESULT_CARD)
  bindVariable?: string;

  @ApiProperty({ 
    description: 'Result format', 
    enum: ResultFormat, 
    required: false,
    example: ResultFormat.CURRENCY_INR
  })
  @IsOptional()
  @IsEnum(ResultFormat)
  resultFormat?: ResultFormat;

  @ApiProperty({ 
    description: 'Chart type', 
    enum: ChartType, 
    required: false,
    example: ChartType.BAR
  })
  @IsOptional()
  @IsEnum(ChartType)
  chartType?: ChartType;

  @ApiProperty({ 
    description: 'Summary template with {{variable}} placeholders', 
    required: false,
    example: 'Your premium is {{monthly_premium}} per month'
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.type === FieldType.SUMMARY_TEXT)
  summaryTemplate?: string;

  @ApiProperty({ description: 'Card background color', required: false, example: '#f3f4f6' })
  @IsOptional()
  @IsString()
  cardBgColor?: string;

  @ApiProperty({ description: 'Card text color', required: false, example: '#111827' })
  @IsOptional()
  @IsString()
  cardTextColor?: string;

  @ApiProperty({ 
    description: 'Field-level design overrides', 
    required: false,
    example: { fontSize: '16px', fontWeight: 'bold' }
  })
  @IsOptional()
  @IsObject()
  designOverrides?: Record<string, any>;
}
