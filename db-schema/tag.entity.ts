import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { UserTag } from './user-tag.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => UserTag, (userTag) => userTag.tag)
  userTags: UserTag[];
}
