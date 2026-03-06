import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CalcSection } from './calc-section.entity';
import { FieldType, ResultFormat, ChartType } from '../src/modules/calculators/common/enums';

@Entity('calc_fields')
export class CalcField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'section_id' })
  sectionId: string;

  @Column({
    type: 'enum',
    enum: FieldType,
  })
  type: FieldType;

  @Column()
  label: string;

  @Column({ name: 'variable_name' })
  variableName: string;

  @Column({ nullable: true })
  placeholder: string;

  @Column({ default: false })
  required: boolean;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'simple-array', nullable: true })
  options: string[];

  @Column({ type: 'float', nullable: true })
  min: number;

  @Column({ type: 'float', nullable: true })
  max: number;

  @Column({ type: 'float', nullable: true })
  step: number;

  @Column({ name: 'default_value', nullable: true })
  defaultValue: string;

  @Column({ name: 'help_text', nullable: true })
  helpText: string;

  @Column({ nullable: true })
  prefix: string;

  @Column({ nullable: true })
  suffix: string;

  @Column({ name: 'bind_variable', nullable: true })
  bindVariable: string;

  @Column({
    type: 'enum',
    enum: ResultFormat,
    name: 'result_format',
    nullable: true,
  })
  resultFormat: ResultFormat;

  @Column({
    type: 'enum',
    enum: ChartType,
    name: 'chart_type',
    nullable: true,
  })
  chartType: ChartType;

  @Column({ name: 'summary_template', type: 'text', nullable: true })
  summaryTemplate: string;

  @Column({ name: 'card_bg_color', nullable: true })
  cardBgColor: string;

  @Column({ name: 'card_text_color', nullable: true })
  cardTextColor: string;

  @Column({ name: 'design_overrides', type: 'jsonb', nullable: true })
  designOverrides: Record<string, any>;

  // Relations
  @ManyToOne(() => CalcSection, (section) => section.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: CalcSection;
}
