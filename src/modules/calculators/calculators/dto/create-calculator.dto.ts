import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CalculatorCategory } from '../../common/enums';

export class CreateCalculatorDto {
  @ApiProperty({ 
    description: 'Name of the calculator', 
    minLength: 2, 
    maxLength: 100,
    example: 'Insurance Premium Calculator' 
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
    example: 'Calculate your monthly insurance premium based on coverage and age' 
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ 
    description: 'Category of the calculator', 
    enum: CalculatorCategory,
    example: CalculatorCategory.INSURANCE 
  })
  @IsNotEmpty()
  @IsEnum(CalculatorCategory)
  category: CalculatorCategory;
}
