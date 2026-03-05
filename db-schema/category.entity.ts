import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PersonaCategory } from './persona-categories.entity';
import { BlogCategory } from './blog-category.entity';
import { OrganizationFeedCategory } from './organization-feed-categories.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tile_pic: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alias: string;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ type: 'integer', nullable: true })
  lft: number;

  @Column({ type: 'integer', nullable: true })
  rgt: number;

  @Column({ type: 'integer', nullable: true })
  parent_id: number;

  @Column({ type: 'jsonb', nullable: true })
  translations: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  configs: Record<string, any>;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => BlogCategory, (blogCategory) => blogCategory.category)
  blogCategories: BlogCategory[];

  @OneToMany(
    () => OrganizationFeedCategory,
    (orgFeedCategory) => orgFeedCategory.category,
  )
  organizationFeedCategories: OrganizationFeedCategory[];

  @OneToMany(
    () => PersonaCategory,
    (personaCategory) => personaCategory.category,
  )
  personaCategories: PersonaCategory[];
}
