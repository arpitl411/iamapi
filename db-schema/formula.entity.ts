import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Calculator } from './calculator.entity';
import { FormulaType } from '../src/modules/calculators/common/enums';

@Entity('formulas')
export class Formula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id' })
  calculatorId: string;

  @Column()
  name: string;

  @Column({ name: 'output_variable' })
  outputVariable: string;

  @Column({
    type: 'enum',
    enum: FormulaType,
  })
  type: FormulaType;

  @Column({ type: 'jsonb', nullable: true })
  steps: Array<{
    operand1: string;
    operator: string;
    operand2: string;
    staticValue?: number;
  }>;

  @Column({ type: 'text', nullable: true })
  expression: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Calculator, (calculator) => calculator.formulas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;
}
