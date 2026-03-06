import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('content_categories')
export class ContentCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'jsonb' })
  name: any;

  @Column({ type: 'jsonb', nullable: true })
  description: any;

  @Column({ name: '_lft', type: 'int', nullable: true })
  lft: number;

  @Column({ name: '_rgt', type: 'int', nullable: true })
  rgt: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
