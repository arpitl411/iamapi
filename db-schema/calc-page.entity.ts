import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Calculator } from './calculator.entity';
import { CalcSection } from './calc-section.entity';

@Entity('calc_pages')
export class CalcPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id' })
  calculatorId: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ name: 'is_result_page', default: false })
  isResultPage: boolean;

  // Relations
  @ManyToOne(() => Calculator, (calculator) => calculator.pages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;

  @OneToMany(() => CalcSection, (section) => section.page, { cascade: true })
  sections: CalcSection[];
}
