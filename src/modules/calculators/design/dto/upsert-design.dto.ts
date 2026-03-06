import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { FontSize, ButtonSize, ButtonWidth } from '../../common/enums';

export class UpsertDesignDto {
  @ApiProperty({ description: 'Primary color (hex)', required: false, example: '#6366f1' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiProperty({ description: 'Background color (hex)', required: false, example: '#ffffff' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ description: 'Font family', required: false, example: 'DM Sans' })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiProperty({ description: 'Font size', enum: FontSize, required: false })
  @IsOptional()
  @IsEnum(FontSize)
  fontSize?: FontSize;

  @ApiProperty({ description: 'Border radius in pixels', required: false, example: 8 })
  @IsOptional()
  @IsInt()
  borderRadius?: number;

  @ApiProperty({ description: 'Button color (hex)', required: false, example: '#6366f1' })
  @IsOptional()
  @IsString()
  buttonColor?: string;

  @ApiProperty({ description: 'Button text color (hex)', required: false, example: '#ffffff' })
  @IsOptional()
  @IsString()
  buttonTextColor?: string;

  @ApiProperty({ description: 'Button border radius in pixels', required: false, example: 8 })
  @IsOptional()
  @IsInt()
  buttonBorderRadius?: number;

  @ApiProperty({ description: 'Button size', enum: ButtonSize, required: false })
  @IsOptional()
  @IsEnum(ButtonSize)
  buttonSize?: ButtonSize;

  @ApiProperty({ description: 'Button width', enum: ButtonWidth, required: false })
  @IsOptional()
  @IsEnum(ButtonWidth)
  buttonWidth?: ButtonWidth;

  @ApiProperty({ description: 'Logo URL', required: false, example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Header background color (hex)', required: false, example: '#6366f1' })
  @IsOptional()
  @IsString()
  headerBgColor?: string;

  @ApiProperty({ description: 'Header text color (hex)', required: false, example: '#ffffff' })
  @IsOptional()
  @IsString()
  headerTextColor?: string;
}
