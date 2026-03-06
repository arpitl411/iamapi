import { Module } from '@nestjs/common';
import { CalculatorsModule } from './calculators/calculators.module';
import { PagesModule } from './pages/pages.module';
import { SectionsModule } from './sections/sections.module';
import { FieldsModule } from './fields/fields.module';
import { FormulasModule } from './formulas/formulas.module';
import { RulesModule } from './rules/rules.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DesignModule } from './design/design.module';
import { PublishModule } from './publish/publish.module';

@Module({
  imports: [
    CalculatorsModule,
    PagesModule,
    SectionsModule,
    FieldsModule,
    FormulasModule,
    RulesModule,
    IntegrationsModule,
    DesignModule,
    PublishModule,
  ],
  exports: [
    CalculatorsModule,
    PagesModule,
    SectionsModule,
    FieldsModule,
    FormulasModule,
    RulesModule,
    IntegrationsModule,
    DesignModule,
    PublishModule,
  ],
})
export class DynamicCalculatorsModule {}
