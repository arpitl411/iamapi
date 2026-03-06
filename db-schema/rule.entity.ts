import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Calculator } from './calculator.entity';
import { RuleScope } from '../src/modules/calculators/common/enums';

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id' })
  calculatorId: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'jsonb' })
  conditions: Array<{
    field: string;
    operator: string;
    value?: string | number;
    logicOperator?: string;
  }>;

  @Column({ type: 'jsonb' })
  actions: Array<{
    type: string;
    target: string;
    value?: string;
  }>;

  @Column({
    type: 'enum',
    enum: RuleScope,
    default: RuleScope.ON_CHANGE,
  })
  scope: RuleScope;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Calculator, (calculator) => calculator.rules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;
}
