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

@Entity('organization_feed_categories')
export class OrganizationFeedCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  org_feed_id: number;

  @Column()
  category_id: number;

  @Column()
  persona_id: number;

  @ManyToOne(() => Category, (category) => category.organizationFeedCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}