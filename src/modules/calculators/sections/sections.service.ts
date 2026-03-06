import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CalcSection } from '../../../../db-schema/calc-section.entity';
import { CreateCalcSectionDto } from './dto/create-calc-section.dto';
import { UpdateCalcSectionDto } from './dto/update-calc-section.dto';
import { CalcPage } from '../../../../db-schema/calc-page.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(CalcSection)
    private sectionRepository: Repository<CalcSection>,
    @InjectRepository(CalcPage)
    private pageRepository: Repository<CalcPage>,
    private dataSource: DataSource,
  ) {}

  async create(
    pageId: string,
    createDto: CreateCalcSectionDto,
  ): Promise<CalcSection> {
    // Verify page exists
    const page = await this.pageRepository.findOne({ where: { id: pageId } });

    if (!page) {
      throw new NotFoundException(`Page with ID ${pageId} not found`);
    }

    // Get the next order number
    const maxOrder = await this.sectionRepository
      .createQueryBuilder('section')
      .where('section.pageId = :pageId', { pageId })
      .select('MAX(section.order)', 'max')
      .getRawOne();

    const order = createDto.order ?? (maxOrder.max || 0) + 1;

    const section = this.sectionRepository.create({
      ...createDto,
      pageId,
      order,
    });

    return this.sectionRepository.save(section);
  }

  async findAll(pageId: string): Promise<CalcSection[]> {
    return this.sectionRepository.find({
      where: { pageId },
      relations: ['fields'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CalcSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['fields'],
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async update(
    id: string,
    updateDto: UpdateCalcSectionDto,
  ): Promise<CalcSection> {
    const section = await this.findOne(id);

    Object.assign(section, updateDto);

    return this.sectionRepository.save(section);
  }

  async remove(id: string): Promise<void> {
    const section = await this.findOne(id);
    await this.sectionRepository.remove(section);
  }

  async reorder(pageId: string, orderedIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await manager.update(
          CalcSection,
          { id: orderedIds[i], pageId },
          { order: i + 1 },
        );
      }
    });
  }
}
