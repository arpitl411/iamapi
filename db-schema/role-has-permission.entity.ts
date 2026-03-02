import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('role_has_permissions', { schema: 'public' })
export class RoleHasPermission {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}