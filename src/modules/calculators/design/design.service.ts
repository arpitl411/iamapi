import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculatorDesign } from '../../../../db-schema/calculator-design.entity';
import { UpsertDesignDto } from './dto/upsert-design.dto';
import { Calculator } from '../../../../db-schema/calculator.entity';

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(CalculatorDesign)
    private designRepository: Repository<CalculatorDesign>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
  ) {}

  async get(calculatorId: string): Promise<CalculatorDesign> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Find existing design or create default
    let design = await this.designRepository.findOne({
      where: { calculatorId },
    });

    if (!design) {
      // Create default design
      design = this.designRepository.create({
        calculatorId,
      });
      await this.designRepository.save(design);
    }

    return design;
  }

  async upsert(
    calculatorId: string,
    upsertDto: UpsertDesignDto,
  ): Promise<CalculatorDesign> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Find existing design
    let design = await this.designRepository.findOne({
      where: { calculatorId },
    });

    if (design) {
      // Update existing
      Object.assign(design, upsertDto);
    } else {
      // Create new
      design = this.designRepository.create({
        ...upsertDto,
        calculatorId,
      });
    }

    return this.designRepository.save(design);
  }
}
