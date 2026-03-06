import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BlogCategory } from './blog-category.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'tile_pic', type: 'varchar', length: 255, nullable: true })
  tilePic: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alias: string;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ name: '_lft', type: 'int', nullable: true })
  lft: number;

  @Column({ name: '_rgt', type: 'int', nullable: true })
  rgt: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number;

  @Column({ type: 'jsonb', nullable: true })
  translations: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  configs: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BlogCategory, (blogCategory) => blogCategory.category)
  blogCategories: BlogCategory[];
}
