import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Calculator } from './calculator.entity';

@Entity('calc_publishes')
export class CalcPublish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'calculator_id', unique: true })
  calculatorId: string;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ name: 'published_by', nullable: true })
  publishedBy: string;

  @Column({ name: 'embed_url', nullable: true })
  embedUrl: string;

  @Column({ name: 'iframe_code', type: 'text', nullable: true })
  iframeCode: string;

  @Column({ name: 'json_config', type: 'jsonb', nullable: true })
  jsonConfig: Record<string, any>;

  @Column({ name: 'is_live', default: false })
  isLive: boolean;

  // Relations
  @OneToOne(() => Calculator, (calculator) => calculator.publish, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'calculator_id' })
  calculator: Calculator;
}
