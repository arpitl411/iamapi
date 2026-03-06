import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Rule } from '../../../../db-schema/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Calculator } from '../../../../db-schema/calculator.entity';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    private dataSource: DataSource,
  ) {}

  async create(calculatorId: string, createDto: CreateRuleDto): Promise<Rule> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Get the next order number
    const maxOrder = await this.ruleRepository
      .createQueryBuilder('rule')
      .where('rule.calculatorId = :calculatorId', { calculatorId })
      .select('MAX(rule.order)', 'max')
      .getRawOne();

    const order = createDto.order ?? (maxOrder.max || 0) + 1;

    const rule = this.ruleRepository.create({
      ...createDto,
      calculatorId,
      order,
    });

    return this.ruleRepository.save(rule);
  }

  async findAll(calculatorId: string): Promise<Rule[]> {
    return this.ruleRepository.find({
      where: { calculatorId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: string, updateDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id);

    Object.assign(rule, updateDto);

    return this.ruleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.ruleRepository.remove(rule);
  }

  async reorder(calculatorId: string, orderedIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await manager.update(
          Rule,
          { id: orderedIds[i], calculatorId },
          { order: i + 1 },
        );
      }
    });
  }

  async toggle(id: string): Promise<Rule> {
    const rule = await this.findOne(id);

    rule.isActive = !rule.isActive;

    return this.ruleRepository.save(rule);
  }
}
