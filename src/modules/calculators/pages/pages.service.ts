import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CalcPage } from '../../../../db-schema/calc-page.entity';
import { CreateCalcPageDto } from './dto/create-calc-page.dto';
import { UpdateCalcPageDto } from './dto/update-calc-page.dto';
import { Calculator } from '../../../../db-schema/calculator.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(CalcPage)
    private pageRepository: Repository<CalcPage>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    private dataSource: DataSource,
  ) {}

  async create(
    calculatorId: string,
    createDto: CreateCalcPageDto,
  ): Promise<CalcPage> {
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
    const maxOrder = await this.pageRepository
      .createQueryBuilder('page')
      .where('page.calculatorId = :calculatorId', { calculatorId })
      .select('MAX(page.order)', 'max')
      .getRawOne();

    const order = createDto.order ?? (maxOrder.max || 0) + 1;

    const page = this.pageRepository.create({
      ...createDto,
      calculatorId,
      order,
    });

    return this.pageRepository.save(page);
  }

  async findAll(calculatorId: string): Promise<CalcPage[]> {
    return this.pageRepository.find({
      where: { calculatorId },
      relations: ['sections', 'sections.fields'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CalcPage> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: ['sections', 'sections.fields'],
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    return page;
  }

  async update(id: string, updateDto: UpdateCalcPageDto): Promise<CalcPage> {
    const page = await this.findOne(id);

    Object.assign(page, updateDto);

    return this.pageRepository.save(page);
  }

  async remove(id: string): Promise<void> {
    const page = await this.findOne(id);
    await this.pageRepository.remove(page);
  }

  async reorder(calculatorId: string, orderedIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await manager.update(
          CalcPage,
          { id: orderedIds[i], calculatorId },
          { order: i + 1 },
        );
      }
    });
  }
}
