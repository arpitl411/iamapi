import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CalcField } from '../../../../db-schema/calc-field.entity';
import { CreateCalcFieldDto } from './dto/create-calc-field.dto';
import { UpdateCalcFieldDto } from './dto/update-calc-field.dto';
import { CalcSection } from '../../../../db-schema/calc-section.entity';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(CalcField)
    private fieldRepository: Repository<CalcField>,
    @InjectRepository(CalcSection)
    private sectionRepository: Repository<CalcSection>,
    private dataSource: DataSource,
  ) {}

  async create(
    sectionId: string,
    createDto: CreateCalcFieldDto,
  ): Promise<CalcField> {
    // Verify section exists
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['page', 'page.calculator'],
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }

    // Check for unique variable name within the calculator
    await this.checkVariableNameUniqueness(
      section.page.calculatorId,
      createDto.variableName,
    );

    // Get the next order number
    const maxOrder = await this.fieldRepository
      .createQueryBuilder('field')
      .where('field.sectionId = :sectionId', { sectionId })
      .select('MAX(field.order)', 'max')
      .getRawOne();

    const order = createDto.order ?? (maxOrder.max || 0) + 1;

    const field = this.fieldRepository.create({
      ...createDto,
      sectionId,
      order,
    });

    return this.fieldRepository.save(field);
  }

  async findAll(sectionId: string): Promise<CalcField[]> {
    return this.fieldRepository.find({
      where: { sectionId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CalcField> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['section', 'section.page'],
    });

    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    return field;
  }

  async update(id: string, updateDto: UpdateCalcFieldDto): Promise<CalcField> {
    const field = await this.findOne(id);

    // If variable name is being updated, check uniqueness
    if (
      updateDto.variableName &&
      updateDto.variableName !== field.variableName
    ) {
      await this.checkVariableNameUniqueness(
        field.section.page.calculatorId,
        updateDto.variableName,
        id,
      );
    }

    Object.assign(field, updateDto);

    return this.fieldRepository.save(field);
  }

  async remove(id: string): Promise<void> {
    const field = await this.findOne(id);
    await this.fieldRepository.remove(field);
  }

  async reorder(sectionId: string, orderedIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await manager.update(
          CalcField,
          { id: orderedIds[i], sectionId },
          { order: i + 1 },
        );
      }
    });
  }

  async duplicate(id: string): Promise<CalcField> {
    const originalField = await this.findOne(id);

    // Create a copy with modified variable name
    const newVariableName = `${originalField.variableName}_copy`;

    // Ensure the new variable name is unique
    let finalVariableName = newVariableName;
    let counter = 1;
    while (
      await this.isVariableNameTaken(
        originalField.section.page.calculatorId,
        finalVariableName,
      )
    ) {
      finalVariableName = `${newVariableName}_${counter}`;
      counter++;
    }

    // Get the next order number
    const maxOrder = await this.fieldRepository
      .createQueryBuilder('field')
      .where('field.sectionId = :sectionId', {
        sectionId: originalField.sectionId,
      })
      .select('MAX(field.order)', 'max')
      .getRawOne();

    const order = (maxOrder.max || 0) + 1;

    const duplicatedField = this.fieldRepository.create({
      ...originalField,
      id: undefined, // Let TypeORM generate a new ID
      variableName: finalVariableName,
      label: `${originalField.label} (Copy)`,
      order,
    });

    return this.fieldRepository.save(duplicatedField);
  }

  private async checkVariableNameUniqueness(
    calculatorId: string,
    variableName: string,
    excludeFieldId?: string,
  ): Promise<void> {
    const query = this.fieldRepository
      .createQueryBuilder('field')
      .innerJoin('field.section', 'section')
      .innerJoin('section.page', 'page')
      .where('page.calculatorId = :calculatorId', { calculatorId })
      .andWhere('field.variableName = :variableName', { variableName });

    if (excludeFieldId) {
      query.andWhere('field.id != :excludeFieldId', { excludeFieldId });
    }

    const existing = await query.getOne();

    if (existing) {
      throw new ConflictException(
        `Variable name "${variableName}" is already used in this calculator`,
      );
    }
  }

  private async isVariableNameTaken(
    calculatorId: string,
    variableName: string,
  ): Promise<boolean> {
    const count = await this.fieldRepository
      .createQueryBuilder('field')
      .innerJoin('field.section', 'section')
      .innerJoin('section.page', 'page')
      .where('page.calculatorId = :calculatorId', { calculatorId })
      .andWhere('field.variableName = :variableName', { variableName })
      .getCount();

    return count > 0;
  }
}
