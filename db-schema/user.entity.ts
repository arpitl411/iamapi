import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { UserPersona } from './user-persons.entity';

@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  first_name: string;

  @Column({ name: 'last_name', nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  // smallint → boolean transformer (keeps DB compatibility)
  @Column({
    type: 'smallint',
    default: 1,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
  })
  active: boolean;

  @Column({ name: 'confirmation_code', nullable: true })
  confirmationCode: string;

  @Column({ default: false })
  confirmed: boolean;

  // Keeping as timestamptz to match original entity
  @Column({ type: 'timestamptz', nullable: true })
  timezone: Date;

  @Column({ name: 'user_name', nullable: true })
  userName: string;

  @Column({ name: 'phone_country_code', nullable: true })
  phoneCountryCode: string;

  @Column({ name: 'phone_no', nullable: true })
  phoneNo: string;

  @Column({ name: 'profile_pic', nullable: true })
  profilePic: string;

  @Column({ name: 'profile_pic_2', nullable: true })
  profilePic2: string;

  @Column({ name: 'profile_pic_3', nullable: true })
  profilePic3: string;

  @Column({ nullable: true })
  uuid: string;

  @Column({ name: 'user_json', type: 'jsonb', nullable: true })
  userJson: Record<string, any>;

  @Column({ name: 'user_configs', type: 'jsonb', nullable: true })
  userConfigs: Record<string, any>;

  // Default aligned with original entity (false)
  @Column({ name: 'new_user', default: false })
  newUser: boolean;

  @Column({ name: 'persona_set_id', type: 'integer', nullable: true })
  personaSetId: number;

  @Column({ name: 'updated_by_id', type: 'integer', nullable: true })
  updatedById: number;

  @Column({ name: 'password_changed_at', type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ name: 'remember_token', length: 255, nullable: true })
  rememberToken: string;

  // Hidden from default select queries
  @Column({ type: 'tsvector', nullable: true, select: false })
  tsv: any;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relations

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'model_has_roles',
    joinColumn: { name: 'model_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => UserPersona, (userPersona) => userPersona.user)
  userPersonas: UserPersona[];
}