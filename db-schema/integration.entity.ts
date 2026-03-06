import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Calculator } from './calculator.entity';
import { IntegrationType, HttpMethod, IntegrationTrigger } from '../src/modules/calculators/common/enums';

@Entity('integrations')
export class Integration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id' })
  calculatorId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  type: IntegrationType;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: HttpMethod,
  })
  method: HttpMethod;

  @Column({ type: 'jsonb', nullable: true })
  headers: Record<string, string>;

  @Column({ name: 'payload_mapping', type: 'jsonb', nullable: true })
  payloadMapping: Record<string, string>;

  @Column({ name: 'response_mapping', type: 'jsonb', nullable: true })
  responseMapping: Record<string, string>;

  @Column({
    name: 'trigger_on',
    type: 'enum',
    enum: IntegrationTrigger,
  })
  triggerOn: IntegrationTrigger;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Calculator, (calculator) => calculator.integrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;
}
