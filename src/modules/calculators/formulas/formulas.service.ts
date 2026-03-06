import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formula } from '../../../../db-schema/formula.entity';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';
import { Calculator } from '../../../../db-schema/calculator.entity';

@Injectable()
export class FormulasService {
  constructor(
    @InjectRepository(Formula)
    private formulaRepository: Repository<Formula>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
  ) {}

  async create(
    calculatorId: string,
    createDto: CreateFormulaDto,
  ): Promise<Formula> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Check for unique output variable name
    await this.checkOutputVariableUniqueness(
      calculatorId,
      createDto.outputVariable,
    );

    const formula = this.formulaRepository.create({
      ...createDto,
      calculatorId,
    });

    return this.formulaRepository.save(formula);
  }

  async findAll(calculatorId: string): Promise<Formula[]> {
    return this.formulaRepository.find({
      where: { calculatorId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Formula> {
    const formula = await this.formulaRepository.findOne({
      where: { id },
    });

    if (!formula) {
      throw new NotFoundException(`Formula with ID ${id} not found`);
    }

    return formula;
  }

  async update(id: string, updateDto: UpdateFormulaDto): Promise<Formula> {
    const formula = await this.findOne(id);

    // If output variable is being updated, check uniqueness
    if (
      updateDto.outputVariable &&
      updateDto.outputVariable !== formula.outputVariable
    ) {
      await this.checkOutputVariableUniqueness(
        formula.calculatorId,
        updateDto.outputVariable,
        id,
      );
    }

    Object.assign(formula, updateDto);

    return this.formulaRepository.save(formula);
  }

  async remove(id: string): Promise<void> {
    const formula = await this.findOne(id);
    await this.formulaRepository.remove(formula);
  }

  async getVariables(calculatorId: string): Promise<string[]> {
    const formulas = await this.formulaRepository.find({
      where: { calculatorId },
      select: ['outputVariable'],
    });

    return formulas.map((f) => f.outputVariable);
  }

  private async checkOutputVariableUniqueness(
    calculatorId: string,
    outputVariable: string,
    excludeFormulaId?: string,
  ): Promise<void> {
    const query = this.formulaRepository
      .createQueryBuilder('formula')
      .where('formula.calculatorId = :calculatorId', { calculatorId })
      .andWhere('formula.outputVariable = :outputVariable', {
        outputVariable,
      });

    if (excludeFormulaId) {
      query.andWhere('formula.id != :excludeFormulaId', { excludeFormulaId });
    }

    const existing = await query.getOne();

    if (existing) {
      throw new ConflictException(
        `Output variable "${outputVariable}" is already used in this calculator`,
      );
    }
  }
}
