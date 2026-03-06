import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Calculator } from './calculator.entity';
import { FontSize, ButtonSize, ButtonWidth } from '../src/modules/calculators/common/enums';

@Entity('calculator_designs')
export class CalculatorDesign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id', unique: true })
  calculatorId: string;

  @Column({ name: 'primary_color', default: '#6366f1' })
  primaryColor: string;

  @Column({ name: 'background_color', default: '#ffffff' })
  backgroundColor: string;

  @Column({ name: 'font_family', default: 'DM Sans' })
  fontFamily: string;

  @Column({
    name: 'font_size',
    type: 'enum',
    enum: FontSize,
    default: FontSize.MD,
  })
  fontSize: FontSize;

  @Column({ name: 'border_radius', type: 'int', default: 8 })
  borderRadius: number;

  @Column({ name: 'button_color', default: '#6366f1' })
  buttonColor: string;

  @Column({ name: 'button_text_color', default: '#ffffff' })
  buttonTextColor: string;

  @Column({ name: 'button_border_radius', type: 'int', default: 8 })
  buttonBorderRadius: number;

  @Column({
    name: 'button_size',
    type: 'enum',
    enum: ButtonSize,
    default: ButtonSize.MD,
  })
  buttonSize: ButtonSize;

  @Column({
    name: 'button_width',
    type: 'enum',
    enum: ButtonWidth,
    default: ButtonWidth.AUTO,
  })
  buttonWidth: ButtonWidth;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'header_bg_color', default: '#6366f1' })
  headerBgColor: string;

  @Column({ name: 'header_text_color', default: '#ffffff' })
  headerTextColor: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Calculator, (calculator) => calculator.design, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;
}
