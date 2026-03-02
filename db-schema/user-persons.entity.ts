import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_personas', { schema: 'public' })
export class UserPersona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'persona_id' })
  personaId: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'tsv', type: 'tsvector', nullable: true, select: false })
  tsv: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userPersonas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}