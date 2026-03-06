# Dynamic Calculators Feature

A comprehensive no-code calculator builder feature for NestJS applications, allowing organizations to create, configure, and publish custom calculators for insurance premiums, SIP returns, loan EMI, tax estimators, and more.

## 📁 Module Structure

```
src/calculators/
├── common/
│   └── enums.ts                    # All enums used across modules
├── calculators/
│   ├── calculator.entity.ts
│   ├── calculators.service.ts
│   ├── calculators.controller.ts
│   ├── calculators.module.ts
│   └── dto/
│       ├── create-calculator.dto.ts
│       ├── update-calculator.dto.ts
│       └── calculator-response.dto.ts
├── pages/
│   ├── calc-page.entity.ts
│   ├── pages.service.ts
│   ├── pages.controller.ts
│   ├── pages.module.ts
│   └── dto/
│       ├── create-calc-page.dto.ts
│       ├── update-calc-page.dto.ts
│       └── reorder.dto.ts
├── sections/
│   ├── calc-section.entity.ts
│   ├── sections.service.ts
│   ├── sections.controller.ts
│   ├── sections.module.ts
│   └── dto/
│       ├── create-calc-section.dto.ts
│       └── update-calc-section.dto.ts
├── fields/
│   ├── calc-field.entity.ts
│   ├── fields.service.ts
│   ├── fields.controller.ts
│   ├── fields.module.ts
│   └── dto/
│       ├── create-calc-field.dto.ts
│       └── update-calc-field.dto.ts
├── formulas/
│   ├── formula.entity.ts
│   ├── formulas.service.ts
│   ├── formulas.controller.ts
│   ├── formulas.module.ts
│   └── dto/
│       ├── create-formula.dto.ts
│       └── update-formula.dto.ts
├── rules/
│   ├── rule.entity.ts
│   ├── rules.service.ts
│   ├── rules.controller.ts
│   ├── rules.module.ts
│   └── dto/
│       ├── create-rule.dto.ts
│       └── update-rule.dto.ts
├── integrations/
│   ├── integration.entity.ts
│   ├── integrations.service.ts
│   ├── integrations.controller.ts
│   ├── integrations.module.ts
│   └── dto/
│       ├── create-integration.dto.ts
│       └── update-integration.dto.ts
├── design/
│   ├── calculator-design.entity.ts
│   ├── design.service.ts
│   ├── design.controller.ts
│   ├── design.module.ts
│   └── dto/
│       └── upsert-design.dto.ts
├── publish/
│   ├── calc-publish.entity.ts
│   ├── publish.service.ts
│   ├── publish.controller.ts
│   ├── publish.module.ts
└── dynamic-calculators.module.ts   # Root module
```

## 🚀 Installation

### 1. Import the Module

Add the `DynamicCalculatorsModule` to your `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { DynamicCalculatorsModule } from './calculators/dynamic-calculators.module';

@Module({
  imports: [
    // ... your existing imports
    DynamicCalculatorsModule,
  ],
})
export class AppModule {}
```

### 2. Database Migrations

Run migrations to create all necessary database tables:

```bash
npm run typeorm migration:generate -- -n CreateDynamicCalculatorsTables
npm run typeorm migration:run
```

Or sync your database (development only):

```typescript
TypeOrmModule.forRoot({
  // ... other config
  synchronize: true, // Only in development!
  entities: [
    // ... other entities
    'src/calculators/**/*.entity.ts',
  ],
})
```

### 3. Install Dependencies

Ensure you have the required dependencies:

```bash
npm install @nestjs/axios axios
```

## 📚 Database Entities

### 9 Core Entities

1. **Calculator** - Main calculator configuration
2. **CalcPage** - Pages within a calculator
3. **CalcSection** - Sections within pages
4. **CalcField** - Form fields with various types
5. **Formula** - Mathematical calculations
6. **Rule** - Conditional logic
7. **Integration** - Third-party API connections
8. **CalculatorDesign** - Styling and theme settings
9. **CalcPublish** - Publishing and embed configuration

## 🔌 API Endpoints

All routes are prefixed with `/api/v1` and require JWT authentication.

### Calculators

```
GET    /organizations/:orgId/calculators              # List all
POST   /organizations/:orgId/calculators              # Create
GET    /organizations/:orgId/calculators/:id          # Get one
PATCH  /organizations/:orgId/calculators/:id          # Update
DELETE /organizations/:orgId/calculators/:id          # Archive
GET    /organizations/:orgId/calculators/stats        # Statistics
```

### Pages

```
GET    /calculators/:calcId/pages                     # List all
POST   /calculators/:calcId/pages                     # Create
GET    /calculators/:calcId/pages/:id                 # Get one
PATCH  /calculators/:calcId/pages/:id                 # Update
DELETE /calculators/:calcId/pages/:id                 # Delete
POST   /calculators/:calcId/pages/reorder             # Reorder
```

### Sections

```
GET    /pages/:pageId/sections                        # List all
POST   /pages/:pageId/sections                        # Create
GET    /pages/:pageId/sections/:id                    # Get one
PATCH  /pages/:pageId/sections/:id                    # Update
DELETE /pages/:pageId/sections/:id                    # Delete
POST   /pages/:pageId/sections/reorder                # Reorder
```

### Fields

```
GET    /sections/:sectionId/fields                    # List all
POST   /sections/:sectionId/fields                    # Create
GET    /sections/:sectionId/fields/:id                # Get one
PATCH  /sections/:sectionId/fields/:id                # Update
DELETE /sections/:sectionId/fields/:id                # Delete
POST   /sections/:sectionId/fields/reorder            # Reorder
POST   /fields/:id/duplicate                          # Duplicate
```

### Formulas

```
GET    /calculators/:calcId/formulas                  # List all
POST   /calculators/:calcId/formulas                  # Create
GET    /calculators/:calcId/formulas/:id              # Get one
PATCH  /calculators/:calcId/formulas/:id              # Update
DELETE /calculators/:calcId/formulas/:id              # Delete
GET    /calculators/:calcId/formulas/variables        # List variables
```

### Rules

```
GET    /calculators/:calcId/rules                     # List all
POST   /calculators/:calcId/rules                     # Create
PATCH  /calculators/:calcId/rules/:id                 # Update
DELETE /calculators/:calcId/rules/:id                 # Delete
POST   /calculators/:calcId/rules/reorder             # Reorder
PATCH  /calculators/:calcId/rules/:id/toggle          # Toggle active
```

### Integrations

```
GET    /calculators/:calcId/integrations              # List all
POST   /calculators/:calcId/integrations              # Create
PATCH  /calculators/:calcId/integrations/:id          # Update
DELETE /calculators/:calcId/integrations/:id          # Delete
PATCH  /calculators/:calcId/integrations/:id/toggle   # Toggle active
POST   /calculators/:calcId/integrations/:id/test     # Test
```

### Design

```
GET    /calculators/:calcId/design                    # Get settings
PUT    /calculators/:calcId/design                    # Upsert settings
```

### Publish

```
GET    /calculators/:calcId/publish                   # Get status
POST   /calculators/:calcId/publish                   # Publish
POST   /calculators/:calcId/unpublish                 # Unpublish
GET    /calculators/:calcId/publish/embed             # Get embed code
```

## 📖 Usage Examples

### Creating a Calculator

```typescript
POST /api/v1/organizations/org-123/calculators
{
  "name": "Insurance Premium Calculator",
  "description": "Calculate monthly insurance premium",
  "category": "insurance"
}
```

### Adding a Page

```typescript
POST /api/v1/calculators/calc-123/pages
{
  "title": "Personal Information",
  "order": 1,
  "isResultPage": false
}
```

### Adding a Field

```typescript
POST /api/v1/sections/section-123/fields
{
  "type": "number",
  "label": "Age",
  "variableName": "user_age",
  "placeholder": "Enter your age",
  "required": true,
  "min": 18,
  "max": 100
}
```

### Creating a Formula

```typescript
POST /api/v1/calculators/calc-123/formulas
{
  "name": "Calculate Monthly Premium",
  "outputVariable": "monthly_premium",
  "type": "step",
  "steps": [
    {
      "operand1": "coverage_amount",
      "operator": "*",
      "operand2": "rate",
      "staticValue": 0.05
    }
  ]
}
```

### Publishing

```typescript
POST /api/v1/calculators/calc-123/publish
// Returns embed code and URL
```

## 🎨 Features

### Field Types Supported

- **Input Fields**: number, text, email, phone, textarea
- **Selection**: dropdown, radio, checkbox, toggle
- **Date**: date picker
- **Slider**: numeric slider with min/max
- **Result Display**: result_card, chart, summary_text

### Formula Types

- **Step-by-step**: Visual formula builder with operations
- **Advanced**: Custom expressions with variables

### Rule Operators

- equals, not_equal
- greater_than, less_than
- greater_or_equal, less_or_equal
- is_null, is_not_null, is_present

### Integration Types

- Webhook
- REST API
- CRM
- Email

## 🔒 Security

- All endpoints protected with `JwtAuthGuard`
- Organization-level data isolation
- Variable name uniqueness validation
- Input validation with class-validator

## 🧪 Testing Integration

Test an integration endpoint:

```typescript
POST /api/v1/calculators/calc-123/integrations/int-123/test
// Fires actual HTTP request with mock data
```

## 📝 Notes

- Variable names must be snake_case
- Variables are unique within a calculator
- Publishing validates minimum structure (1 page, 1 section, 1 field)
- Reorder operations use transactions for consistency
- Field duplication creates copy with unique variable name

## 🤝 Contributing

This is a self-contained feature module. To extend:

1. Add new field types in `common/enums.ts`
2. Update validation in respective DTOs
3. Modify entities as needed
4. Update services and controllers

## 📄 License

Part of the IAM API project.
