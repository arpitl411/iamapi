import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CalcPage } from './calc-page.entity';
import { CalcField } from './calc-field.entity';

@Entity('calc_sections')
export class CalcSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'page_id' })
  pageId: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'int', default: 1 })
  columns: number;

  // Relations
  @ManyToOne(() => CalcPage, (page) => page.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: CalcPage;

  @OneToMany(() => CalcField, (field) => field.section, { cascade: true })
  fields: CalcField[];
}
