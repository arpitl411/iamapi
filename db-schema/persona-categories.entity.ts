import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('persona_categories')
export class PersonaCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  persona_id: number;

  @Column({ type: 'bigint' })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.personaCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}