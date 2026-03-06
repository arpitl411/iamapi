import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Calculator } from '../../../../db-schema/calculator.entity';
import { CalcPage } from '../../../../db-schema/calc-page.entity';
import { CalcSection } from '../../../../db-schema/calc-section.entity';
import { CalcField } from '../../../../db-schema/calc-field.entity';
import { Formula } from '../../../../db-schema/formula.entity';
import { Rule } from '../../../../db-schema/rule.entity';
import { Integration } from '../../../../db-schema/integration.entity';
import { CalculatorDesign } from '../../../../db-schema/calculator-design.entity';
import { CalcPublish } from '../../../../db-schema/calc-publish.entity';
import { CreateCalculatorDto } from './dto/create-calculator.dto';
import { UpdateCalculatorDto } from './dto/update-calculator.dto';
import { BulkSaveCalculatorDto } from './dto/bulk-save-calculator.dto';
import { BulkUpdateCalculatorDto } from './dto/bulk-update-calculator.dto';
import { CalculatorStatus } from '../common/enums';

@Injectable()
export class CalculatorsService {
  constructor(
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
    @InjectRepository(CalcPage)
    private pageRepository: Repository<CalcPage>,
    @InjectRepository(CalcSection)
    private sectionRepository: Repository<CalcSection>,
    @InjectRepository(CalcField)
    private fieldRepository: Repository<CalcField>,
    @InjectRepository(Formula)
    private formulaRepository: Repository<Formula>,
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
    @InjectRepository(Integration)
    private integrationRepository: Repository<Integration>,
    @InjectRepository(CalculatorDesign)
    private designRepository: Repository<CalculatorDesign>,
    @InjectRepository(CalcPublish)
    private publishRepository: Repository<CalcPublish>,
    private dataSource: DataSource,
  ) {}

  async create(
    organizationId: string,
    createDto: CreateCalculatorDto,
    userId: string,
  ): Promise<Calculator> {
    const calculator = this.calculatorRepository.create({
      ...createDto,
      organizationId,
      createdBy: userId,
    });

    return this.calculatorRepository.save(calculator);
  }

  async findAll(
    organizationId: string,
    filters?: {
      status?: CalculatorStatus;
      category?: string;
      search?: string;
    },
  ): Promise<Calculator[]> {
    const query = this.calculatorRepository
      .createQueryBuilder('calculator')
      .where('calculator.organizationId = :organizationId', { organizationId });

    if (filters?.status) {
      query.andWhere('calculator.status = :status', { status: filters.status });
    }

    if (filters?.category) {
      query.andWhere('calculator.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(calculator.name ILIKE :search OR calculator.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('calculator.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, organizationId: string): Promise<Calculator> {
    const calculator = await this.calculatorRepository.findOne({
      where: { id, organizationId },
      relations: [
        'pages',
        'pages.sections',
        'pages.sections.fields',
        'formulas',
        'rules',
        'integrations',
        'design',
        'publish',
      ],
    });

    if (!calculator) {
      throw new NotFoundException(`Calculator with ID ${id} not found`);
    }

    return calculator;
  }

  async update(
    id: string,
    organizationId: string,
    updateDto: UpdateCalculatorDto,
  ): Promise<Calculator> {
    const calculator = await this.findOne(id, organizationId);

    Object.assign(calculator, updateDto);

    return this.calculatorRepository.save(calculator);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const calculator = await this.findOne(id, organizationId);

    calculator.status = CalculatorStatus.ARCHIVED;
    await this.calculatorRepository.save(calculator);
  }

  /**
   * Bulk save draft - Save entire calculator with all its components in one transaction
   */
  async bulkSaveDraft(
    organizationId: string,
    bulkDto: BulkSaveCalculatorDto,
    userId: string,
  ): Promise<Calculator> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Create calculator
      const calculator = manager.create(Calculator, {
        name: bulkDto.name,
        description: bulkDto.description,
        category: bulkDto.category,
        organizationId,
        createdBy: userId,
        status: CalculatorStatus.DRAFT,
      });
      await manager.save(calculator);

      // 2. Save pages with sections and fields
      if (bulkDto.pages && bulkDto.pages.length > 0) {
        for (let pageIdx = 0; pageIdx < bulkDto.pages.length; pageIdx++) {
          const pageDto = bulkDto.pages[pageIdx];
          const { sections, ...pageData } = pageDto as any;
          const page = manager.create(CalcPage, {
            ...pageData,
            calculatorId: calculator.id,
            order: pageDto.order ?? pageIdx + 1,
          });
          await manager.save(page);

          // Save sections for this page
          if (pageDto.sections && pageDto.sections.length > 0) {
            for (
              let sectionIdx = 0;
              sectionIdx < pageDto.sections.length;
              sectionIdx++
            ) {
              const sectionDto = pageDto.sections[sectionIdx];
              const { fields, ...sectionData } = sectionDto as any;
              const section = manager.create(CalcSection, {
                ...sectionData,
                pageId: page.id,
                order: sectionDto.order ?? sectionIdx + 1,
              });
              await manager.save(section);

              // Save fields for this section
              if (sectionDto.fields && sectionDto.fields.length > 0) {
                for (
                  let fieldIdx = 0;
                  fieldIdx < sectionDto.fields.length;
                  fieldIdx++
                ) {
                  const fieldDto = sectionDto.fields[fieldIdx];
                  const { tempId, ...fieldData } = fieldDto as any;
                  const field = manager.create(CalcField, {
                    ...fieldData,
                    sectionId: section.id,
                    order: fieldDto.order ?? fieldIdx + 1,
                  });
                  await manager.save(field);
                }
              }
            }
          }
        }
      }

      // 3. Save formulas
      if (bulkDto.formulas && bulkDto.formulas.length > 0) {
        for (const formulaDto of bulkDto.formulas) {
          const formula = manager.create(Formula, {
            ...formulaDto,
            calculatorId: calculator.id,
          });
          await manager.save(formula);
        }
      }

      // 4. Save rules
      if (bulkDto.rules && bulkDto.rules.length > 0) {
        for (let ruleIdx = 0; ruleIdx < bulkDto.rules.length; ruleIdx++) {
          const ruleDto = bulkDto.rules[ruleIdx];
          const rule = manager.create(Rule, {
            ...ruleDto,
            calculatorId: calculator.id,
            order: ruleDto.order ?? ruleIdx + 1,
          });
          await manager.save(rule);
        }
      }

      // 5. Save integrations
      if (bulkDto.integrations && bulkDto.integrations.length > 0) {
        for (const integrationDto of bulkDto.integrations) {
          const integration = manager.create(Integration, {
            ...integrationDto,
            calculatorId: calculator.id,
          });
          await manager.save(integration);
        }
      }

      // 6. Save design
      if (bulkDto.design) {
        const design = manager.create(CalculatorDesign, {
          ...bulkDto.design,
          calculatorId: calculator.id,
        });
        await manager.save(design);
      }

      // Return the complete calculator with all relations
      const savedCalculator = await manager.findOne(Calculator, {
        where: { id: calculator.id },
        relations: [
          'pages',
          'pages.sections',
          'pages.sections.fields',
          'formulas',
          'rules',
          'integrations',
          'design',
        ],
      });

      if (!savedCalculator) {
        throw new NotFoundException(
          `Failed to retrieve saved calculator with ID ${calculator.id}`,
        );
      }

      return savedCalculator;
    });
  }

  /**
   * Bulk update draft - Update entire calculator with all its components in one transaction
   */
  async bulkUpdateDraft(
    id: string,
    organizationId: string,
    bulkDto: BulkUpdateCalculatorDto,
  ): Promise<Calculator> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Find and update calculator
      const calculator = await manager.findOne(Calculator, {
        where: { id, organizationId },
      });

      if (!calculator) {
        throw new NotFoundException(`Calculator with ID ${id} not found`);
      }

      // Update calculator metadata
      if (bulkDto.name) calculator.name = bulkDto.name;
      if (bulkDto.description !== undefined)
        calculator.description = bulkDto.description;
      if (bulkDto.category) calculator.category = bulkDto.category;
      await manager.save(calculator);

      // 2. Handle pages, sections, and fields
      if (bulkDto.pages) {
        // Get existing pages
        const existingPages = await manager.find(CalcPage, {
          where: { calculatorId: id },
          relations: ['sections', 'sections.fields'],
        });

        // Track which pages to keep
        const pagesToKeep = new Set<string>();

        for (let pageIdx = 0; pageIdx < bulkDto.pages.length; pageIdx++) {
          const pageDto = bulkDto.pages[pageIdx];

          if (pageDto._delete) {
            // Delete page if marked
            if (pageDto.id) {
              await manager.delete(CalcPage, pageDto.id);
            }
            continue;
          }

          let page: CalcPage | undefined;
          if (pageDto.id) {
            // Update existing page
            page = existingPages.find((p) => p.id === pageDto.id);
            if (page) {
              Object.assign(page, {
                title: pageDto.title ?? page.title,
                order: pageDto.order ?? pageIdx + 1,
                isResultPage: pageDto.isResultPage ?? page.isResultPage,
              });
              await manager.save(page);
              pagesToKeep.add(page.id);
            }
          } else {
            // Create new page
            const { sections, _delete, id: pageId, ...pageData } = pageDto as any;
            page = manager.create(CalcPage, {
              ...pageData,
              calculatorId: id,
              order: pageDto.order ?? pageIdx + 1,
            });
            await manager.save(page);
            pagesToKeep.add(page.id);
          }

          // Handle sections for this page
          if (pageDto.sections && page) {
            const existingSections = await manager.find(CalcSection, {
              where: { pageId: page.id },
              relations: ['fields'],
            });
            const sectionsToKeep = new Set<string>();

            for (
              let sectionIdx = 0;
              sectionIdx < pageDto.sections.length;
              sectionIdx++
            ) {
              const sectionDto = pageDto.sections[sectionIdx];

              if (sectionDto._delete) {
                if (sectionDto.id) {
                  await manager.delete(CalcSection, sectionDto.id);
                }
                continue;
              }

              let section: CalcSection | undefined;
              if (sectionDto.id) {
                // Update existing section
                section = existingSections.find((s) => s.id === sectionDto.id);
                if (section) {
                  Object.assign(section, {
                    name: sectionDto.name ?? section.name,
                    order: sectionDto.order ?? sectionIdx + 1,
                    columns: sectionDto.columns ?? section.columns,
                  });
                  await manager.save(section);
                  sectionsToKeep.add(section.id);
                }
              } else {
                // Create new section
                const { fields, _delete, id: sectionId, ...sectionData } = sectionDto as any;
                section = manager.create(CalcSection, {
                  ...sectionData,
                  pageId: page.id,
                  order: sectionDto.order ?? sectionIdx + 1,
                });
                await manager.save(section);
                sectionsToKeep.add(section.id);
              }

              // Handle fields for this section
              if (sectionDto.fields && section) {
                const existingFields = await manager.find(CalcField, {
                  where: { sectionId: section.id },
                });
                const fieldsToKeep = new Set<string>();

                for (
                  let fieldIdx = 0;
                  fieldIdx < sectionDto.fields.length;
                  fieldIdx++
                ) {
                  const fieldDto = sectionDto.fields[fieldIdx];

                  if (fieldDto._delete) {
                    if (fieldDto.id) {
                      await manager.delete(CalcField, fieldDto.id);
                    }
                    continue;
                  }

                  if (fieldDto.id) {
                    // Update existing field
                    const field = existingFields.find(
                      (f) => f.id === fieldDto.id,
                    );
                    if (field) {
                      const { _delete, id: fieldId, tempId, ...fieldUpdateData } = fieldDto as any;
                      Object.assign(field, {
                        ...fieldUpdateData,
                        order: fieldDto.order ?? fieldIdx + 1,
                      });
                      await manager.save(field);
                      fieldsToKeep.add(field.id);
                    }
                  } else {
                    // Create new field
                    const { _delete, id: fieldId, tempId, ...fieldData } = fieldDto as any;
                    const field = manager.create(CalcField, {
                      ...fieldData,
                      sectionId: section.id,
                      order: fieldDto.order ?? fieldIdx + 1,
                    });
                    await manager.save(field);
                    fieldsToKeep.add(field.id);
                  }
                }

                // Delete fields not in the update
                for (const existingField of existingFields) {
                  if (!fieldsToKeep.has(existingField.id)) {
                    await manager.delete(CalcField, existingField.id);
                  }
                }
              }
            }

            // Delete sections not in the update
            for (const existingSection of existingSections) {
              if (!sectionsToKeep.has(existingSection.id)) {
                await manager.delete(CalcSection, existingSection.id);
              }
            }
          }
        }

        // Delete pages not in the update
        for (const existingPage of existingPages) {
          if (!pagesToKeep.has(existingPage.id)) {
            await manager.delete(CalcPage, existingPage.id);
          }
        }
      }

      // 3. Handle formulas
      if (bulkDto.formulas) {
        const existingFormulas = await manager.find(Formula, {
          where: { calculatorId: id },
        });
        const formulasToKeep = new Set<string>();

        for (const formulaDto of bulkDto.formulas) {
          if (formulaDto._delete) {
            if (formulaDto.id) {
              await manager.delete(Formula, formulaDto.id);
            }
            continue;
          }

          if (formulaDto.id) {
            // Update existing formula
            const formula = existingFormulas.find((f) => f.id === formulaDto.id);
            if (formula) {
              Object.assign(formula, formulaDto);
              await manager.save(formula);
              formulasToKeep.add(formula.id);
            }
          } else {
            // Create new formula
            const formula = manager.create(Formula, {
              ...formulaDto,
              calculatorId: id,
            });
            await manager.save(formula);
            formulasToKeep.add(formula.id);
          }
        }

        // Delete formulas not in the update
        for (const existingFormula of existingFormulas) {
          if (!formulasToKeep.has(existingFormula.id)) {
            await manager.delete(Formula, existingFormula.id);
          }
        }
      }

      // 4. Handle rules
      if (bulkDto.rules) {
        const existingRules = await manager.find(Rule, {
          where: { calculatorId: id },
        });
        const rulesToKeep = new Set<string>();

        for (let ruleIdx = 0; ruleIdx < bulkDto.rules.length; ruleIdx++) {
          const ruleDto = bulkDto.rules[ruleIdx];

          if (ruleDto._delete) {
            if (ruleDto.id) {
              await manager.delete(Rule, ruleDto.id);
            }
            continue;
          }

          if (ruleDto.id) {
            // Update existing rule
            const rule = existingRules.find((r) => r.id === ruleDto.id);
            if (rule) {
              Object.assign(rule, {
                ...ruleDto,
                order: ruleDto.order ?? ruleIdx + 1,
              });
              await manager.save(rule);
              rulesToKeep.add(rule.id);
            }
          } else {
            // Create new rule
            const rule = manager.create(Rule, {
              ...ruleDto,
              calculatorId: id,
              order: ruleDto.order ?? ruleIdx + 1,
            });
            await manager.save(rule);
            rulesToKeep.add(rule.id);
          }
        }

        // Delete rules not in the update
        for (const existingRule of existingRules) {
          if (!rulesToKeep.has(existingRule.id)) {
            await manager.delete(Rule, existingRule.id);
          }
        }
      }

      // 5. Handle integrations
      if (bulkDto.integrations) {
        const existingIntegrations = await manager.find(Integration, {
          where: { calculatorId: id },
        });
        const integrationsToKeep = new Set<string>();

        for (const integrationDto of bulkDto.integrations) {
          if (integrationDto._delete) {
            if (integrationDto.id) {
              await manager.delete(Integration, integrationDto.id);
            }
            continue;
          }

          if (integrationDto.id) {
            // Update existing integration
            const integration = existingIntegrations.find(
              (i) => i.id === integrationDto.id,
            );
            if (integration) {
              Object.assign(integration, integrationDto);
              await manager.save(integration);
              integrationsToKeep.add(integration.id);
            }
          } else {
            // Create new integration
            const integration = manager.create(Integration, {
              ...integrationDto,
              calculatorId: id,
            });
            await manager.save(integration);
            integrationsToKeep.add(integration.id);
          }
        }

        // Delete integrations not in the update
        for (const existingIntegration of existingIntegrations) {
          if (!integrationsToKeep.has(existingIntegration.id)) {
            await manager.delete(Integration, existingIntegration.id);
          }
        }
      }

      // 6. Handle design (upsert)
      if (bulkDto.design) {
        const existingDesign = await manager.findOne(CalculatorDesign, {
          where: { calculatorId: id },
        });

        if (existingDesign) {
          Object.assign(existingDesign, bulkDto.design);
          await manager.save(existingDesign);
        } else {
          const design = manager.create(CalculatorDesign, {
            ...bulkDto.design,
            calculatorId: id,
          });
          await manager.save(design);
        }
      }

      // Return the complete calculator with all relations
      const updatedCalculator = await manager.findOne(Calculator, {
        where: { id },
        relations: [
          'pages',
          'pages.sections',
          'pages.sections.fields',
          'formulas',
          'rules',
          'integrations',
          'design',
        ],
      });

      if (!updatedCalculator) {
        throw new NotFoundException(
          `Failed to retrieve updated calculator with ID ${id}`,
        );
      }

      return updatedCalculator;
    });
  }

  /**
   * Bulk publish - Validate and publish entire calculator in one transaction
   */
  async bulkPublish(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Calculator> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Load calculator with all relations
      const calculator = await manager.findOne(Calculator, {
        where: { id, organizationId },
        relations: [
          'pages',
          'pages.sections',
          'pages.sections.fields',
          'formulas',
          'rules',
          'integrations',
          'design',
        ],
      });

      if (!calculator) {
        throw new NotFoundException(`Calculator with ID ${id} not found`);
      }

      // 2. Validate calculator has minimum requirements
      const errors: string[] = [];

      if (!calculator.pages || calculator.pages.length === 0) {
        errors.push('Calculator must have at least one page');
      }

      // Check if there's at least one field
      let hasFields = false;
      if (calculator.pages) {
        for (const page of calculator.pages) {
          if (page.sections) {
            for (const section of page.sections) {
              if (section.fields && section.fields.length > 0) {
                hasFields = true;
                break;
              }
            }
          }
          if (hasFields) break;
        }
      }

      if (!hasFields) {
        errors.push('Calculator must have at least one input field');
      }

      // Check if there's a result page
      const hasResultPage = calculator.pages?.some((p) => p.isResultPage);
      if (!hasResultPage) {
        errors.push('Calculator must have at least one result page');
      }

      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Calculator validation failed',
          errors,
        });
      }

      // 3. Update calculator status to published
      calculator.status = CalculatorStatus.PUBLISHED;
      await manager.save(calculator);

      // 4. Create or update publish record
      let publishRecord = await manager.findOne(CalcPublish, {
        where: { calculatorId: id },
      });

      if (publishRecord) {
        publishRecord.publishedAt = new Date();
        publishRecord.publishedBy = userId;
        publishRecord.isLive = true;
        await manager.save(publishRecord);
      } else {
        publishRecord = manager.create(CalcPublish, {
          calculatorId: id,
          publishedAt: new Date(),
          publishedBy: userId,
          isLive: true,
        });
        await manager.save(publishRecord);
      }

      return calculator;
    });
  }

  async getStats(organizationId: string): Promise<{
    total: number;
    published: number;
    drafts: number;
    categories: number;
  }> {
    const calculators = await this.calculatorRepository.find({
      where: { organizationId },
    });

    const published = calculators.filter(
      (c) => c.status === CalculatorStatus.PUBLISHED,
    ).length;
    const drafts = calculators.filter(
      (c) => c.status === CalculatorStatus.DRAFT,
    ).length;
    const uniqueCategories = new Set(calculators.map((c) => c.category)).size;

    return {
      total: calculators.length,
      published,
      drafts,
      categories: uniqueCategories,
    };
  }
}
