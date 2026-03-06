import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CalculatorCategory, CalculatorStatus } from '../src/modules/calculators/common/enums';
import { CalcPage } from './calc-page.entity';
import { Formula } from './formula.entity';
import { Rule } from './rule.entity';
import { Integration } from './integration.entity';
import { CalculatorDesign } from './calculator-design.entity';
import { CalcPublish } from './calc-publish.entity';

@Entity('calculators')
export class Calculator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CalculatorCategory,
  })
  category: CalculatorCategory;

  @Column({
    type: 'enum',
    enum: CalculatorStatus,
    default: CalculatorStatus.DRAFT,
  })
  status: CalculatorStatus;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => CalcPage, (page) => page.calculator, { cascade: true })
  pages: CalcPage[];

  @OneToMany(() => Formula, (formula) => formula.calculator, { cascade: true })
  formulas: Formula[];

  @OneToMany(() => Rule, (rule) => rule.calculator, { cascade: true })
  rules: Rule[];

  @OneToMany(() => Integration, (integration) => integration.calculator, {
    cascade: true,
  })
  integrations: Integration[];

  @OneToOne(() => CalculatorDesign, (design) => design.calculator, {
    cascade: true,
  })
  design: CalculatorDesign;

  @OneToOne(() => CalcPublish, (publish) => publish.calculator, {
    cascade: true,
  })
  publish: CalcPublish;
}
