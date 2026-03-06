import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalcPublish } from '../../../../db-schema/calc-publish.entity';
import { Calculator } from '../../../../db-schema/calculator.entity';
import { CalculatorStatus } from '../common/enums';

@Injectable()
export class PublishService {
  constructor(
    @InjectRepository(CalcPublish)
    private publishRepository: Repository<CalcPublish>,
    @InjectRepository(Calculator)
    private calculatorRepository: Repository<Calculator>,
  ) {}

  async getPublishStatus(calculatorId: string): Promise<CalcPublish> {
    // Verify calculator exists
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (!calculator) {
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Find or create publish record
    let publish = await this.publishRepository.findOne({
      where: { calculatorId },
    });

    if (!publish) {
      publish = this.publishRepository.create({
        calculatorId,
        isLive: false,
      });
      await this.publishRepository.save(publish);
    }

    return publish;
  }

  async publish(calculatorId: string, userId: string): Promise<CalcPublish> {
    // Get calculator with all relations
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
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
      throw new NotFoundException(
        `Calculator with ID ${calculatorId} not found`,
      );
    }

    // Validate calculator has minimum required structure
    if (!calculator.pages || calculator.pages.length === 0) {
      throw new BadRequestException(
        'Calculator must have at least one page to publish',
      );
    }

    const hasSections = calculator.pages.some(
      (page) => page.sections && page.sections.length > 0,
    );
    if (!hasSections) {
      throw new BadRequestException(
        'Calculator must have at least one section to publish',
      );
    }

    const hasFields = calculator.pages.some((page) =>
      page.sections.some((section) => section.fields && section.fields.length > 0),
    );
    if (!hasFields) {
      throw new BadRequestException(
        'Calculator must have at least one field to publish',
      );
    }

    // Generate embed URL and iframe code
    const embedUrl = `https://calculators.yourdomain.com/embed/${calculatorId}`;
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;

    // Create JSON snapshot
    const jsonConfig = {
      calculator: {
        id: calculator.id,
        name: calculator.name,
        description: calculator.description,
        category: calculator.category,
      },
      pages: calculator.pages.map((page) => ({
        id: page.id,
        title: page.title,
        order: page.order,
        isResultPage: page.isResultPage,
        sections: page.sections.map((section) => ({
          id: section.id,
          name: section.name,
          order: section.order,
          columns: section.columns,
          fields: section.fields.map((field) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            variableName: field.variableName,
            placeholder: field.placeholder,
            required: field.required,
            order: field.order,
            options: field.options,
            min: field.min,
            max: field.max,
            step: field.step,
            defaultValue: field.defaultValue,
            helpText: field.helpText,
            prefix: field.prefix,
            suffix: field.suffix,
            bindVariable: field.bindVariable,
            resultFormat: field.resultFormat,
            chartType: field.chartType,
            summaryTemplate: field.summaryTemplate,
            cardBgColor: field.cardBgColor,
            cardTextColor: field.cardTextColor,
            designOverrides: field.designOverrides,
          })),
        })),
      })),
      formulas: calculator.formulas,
      rules: calculator.rules,
      integrations: calculator.integrations,
      design: calculator.design,
    };

    // Update calculator status
    calculator.status = CalculatorStatus.PUBLISHED;
    await this.calculatorRepository.save(calculator);

    // Update or create publish record
    let publish = await this.publishRepository.findOne({
      where: { calculatorId },
    });

    if (publish) {
      publish.publishedAt = new Date();
      publish.publishedBy = userId;
      publish.embedUrl = embedUrl;
      publish.iframeCode = iframeCode;
      publish.jsonConfig = jsonConfig;
      publish.isLive = true;
    } else {
      publish = this.publishRepository.create({
        calculatorId,
        publishedAt: new Date(),
        publishedBy: userId,
        embedUrl,
        iframeCode,
        jsonConfig,
        isLive: true,
      });
    }

    return this.publishRepository.save(publish);
  }

  async unpublish(calculatorId: string): Promise<void> {
    const publish = await this.publishRepository.findOne({
      where: { calculatorId },
    });

    if (!publish) {
      throw new NotFoundException(
        `Publish record for calculator ${calculatorId} not found`,
      );
    }

    // Update calculator status
    const calculator = await this.calculatorRepository.findOne({
      where: { id: calculatorId },
    });

    if (calculator) {
      calculator.status = CalculatorStatus.DRAFT;
      await this.calculatorRepository.save(calculator);
    }

    // Update publish record
    publish.isLive = false;
    await this.publishRepository.save(publish);
  }

  async getEmbedInfo(
    calculatorId: string,
  ): Promise<{ iframeCode: string; embedUrl: string; jsonConfig: any }> {
    const publish = await this.publishRepository.findOne({
      where: { calculatorId },
    });

    if (!publish || !publish.isLive) {
      throw new NotFoundException(
        `Calculator ${calculatorId} is not published`,
      );
    }

    return {
      iframeCode: publish.iframeCode,
      embedUrl: publish.embedUrl,
      jsonConfig: publish.jsonConfig,
    };
  }
}
