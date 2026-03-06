# Dynamic Calculators - Quick Setup Guide

## ✅ Installation Complete

The Dynamic Calculators feature has been successfully created with the following structure:

- ✓ 9 Database entities
- ✓ 9 NestJS modules
- ✓ 9 Services with full business logic
- ✓ 9 Controllers with Swagger documentation
- ✓ Complete DTOs with validation
- ✓ All dependencies installed

## 📦 What's Included

### Entities
1. Calculator - Main calculator metadata
2. CalcPage - Calculator pages
3. CalcSection - Page sections
4. CalcField - Form fields (14 types supported)
5. Formula - Math calculations (step-by-step & advanced)
6. Rule - Conditional logic
7. Integration - API webhooks
8. CalculatorDesign - Styling & theme
9. CalcPublish - Publishing & embed codes

### Modules
All modules are self-contained and ready to use:
- CalculatorsModule
- PagesModule
- SectionsModule
- FieldsModule
- FormulasModule
- RulesModule
- IntegrationsModule
- DesignModule
- PublishModule

## 🚀 Next Steps

### Step 1: Import the Main Module

In your `src/app.module.ts`, add:

```typescript
import { DynamicCalculatorsModule } from './calculators/dynamic-calculators.module';

@Module({
  imports: [
    // ... your existing imports
    DynamicCalculatorsModule,
  ],
})
export class AppModule {}
```

### Step 2: Database Setup

#### Option A: TypeORM Synchronization (Development Only)

In your TypeORM configuration, ensure entities are loaded:

```typescript
TypeOrmModule.forRoot({
  // ... other config
  entities: ['dist/**/*.entity.js'],
  synchronize: true, // Set to false in production!
})
```

#### Option B: Create Migration (Recommended for Production)

```bash
npm run typeorm migration:generate -- -n CreateCalculatorsTables
npm run typeorm migration:run
```

### Step 3: Verify Installation

Start your application:

```bash
npm run start:dev
```

Check Swagger documentation at: `http://localhost:3000/api`

You should see 9 new API tags:
- Calculators
- Pages
- Sections
- Fields
- Formulas
- Rules
- Integrations
- Design
- Publish

## 📋 API Overview

### Base URL Pattern
All endpoints use: `/api/v1/`

### Main Endpoints

**Calculators**
```
GET/POST   /organizations/:orgId/calculators
GET        /organizations/:orgId/calculators/stats
GET/PATCH  /organizations/:orgId/calculators/:id
```

**Builder Components**
```
GET/POST   /calculators/:calcId/pages
GET/POST   /pages/:pageId/sections
GET/POST   /sections/:sectionId/fields
```

**Advanced Features**
```
GET/POST   /calculators/:calcId/formulas
GET/POST   /calculators/:calcId/rules
GET/POST   /calculators/:calcId/integrations
GET/PUT    /calculators/:calcId/design
POST       /calculators/:calcId/publish
```

## 🔧 Configuration

### JWT Authentication

All endpoints are protected with `@UseGuards(JwtAuthGuard)`. Ensure your JWT strategy is properly configured.

### User Context

In controllers, replace this placeholder:
```typescript
const userId = 'current-user-id'; // Replace with actual user ID from JWT
```

With your actual user extraction logic:
```typescript
import { CurrentUser } from '../../common/decorators/current-user.decorator';

async create(
  @Param('orgId') orgId: string,
  @Body() createDto: CreateCalculatorDto,
  @CurrentUser() user: any,
) {
  const data = await this.service.create(orgId, createDto, user.id);
  // ...
}
```

### Database Connection

Ensure your database connection supports:
- PostgreSQL (required for JSONB columns)
- UUID generation
- Cascade delete operations

## 🎯 Usage Example

### Creating Your First Calculator

```bash
# 1. Create a calculator
POST /api/v1/organizations/org-123/calculators
{
  "name": "Loan EMI Calculator",
  "category": "loan",
  "description": "Calculate monthly EMI for loans"
}

# 2. Add a page
POST /api/v1/calculators/{calcId}/pages
{
  "title": "Loan Details",
  "order": 1
}

# 3. Add a section
POST /api/v1/pages/{pageId}/sections
{
  "name": "Basic Information",
  "columns": 2
}

# 4. Add fields
POST /api/v1/sections/{sectionId}/fields
{
  "type": "number",
  "label": "Loan Amount",
  "variableName": "loan_amount",
  "required": true,
  "prefix": "₹"
}

# 5. Add formula
POST /api/v1/calculators/{calcId}/formulas
{
  "name": "Calculate EMI",
  "outputVariable": "monthly_emi",
  "type": "advanced",
  "expression": "({{loan_amount}} * {{rate}} * (1 + {{rate}})^{{tenure}}) / ((1 + {{rate}})^{{tenure}} - 1)"
}

# 6. Publish
POST /api/v1/calculators/{calcId}/publish
# Returns embed URL and iframe code
```

## 🔐 Security Features

- JWT authentication on all endpoints
- Organization-level data isolation
- Input validation with class-validator
- XSS protection in form fields
- SQL injection protection via TypeORM

## 📊 Field Types Supported

### Input Types
- `number` - Numeric input with min/max
- `text` - Single line text
- `email` - Email validation
- `phone` - Phone number
- `textarea` - Multi-line text
- `date` - Date picker

### Selection Types
- `dropdown` - Select from options
- `radio` - Radio buttons
- `checkbox` - Multiple checkboxes
- `toggle` - Boolean switch
- `slider` - Numeric slider

### Display Types
- `result_card` - Show calculated results
- `chart` - Display charts (bar, line, donut, pie, area)
- `summary_text` - Template-based summary

## 🎨 Customization

### Design Options
- Primary & background colors
- Font family & size
- Border radius
- Button styling
- Logo URL
- Header colors

### Formula Types
- **Step-by-step**: Visual formula builder
- **Advanced**: Custom expressions with variables

### Integration Options
- Webhook
- REST API
- CRM connections
- Email notifications

## 📚 Documentation

Full documentation is available in:
- `src/calculators/README.md` - Detailed feature documentation
- Swagger UI - Interactive API documentation
- Code comments - Inline documentation

## 🐛 Troubleshooting

### Issue: Entities not syncing
**Solution**: Ensure entities are in the TypeORM configuration:
```typescript
entities: ['dist/**/*.entity.js']
```

### Issue: JWT Guard not working
**Solution**: Verify JwtAuthGuard is properly configured in your auth module

### Issue: CORS errors
**Solution**: Enable CORS in main.ts:
```typescript
app.enableCors();
```

### Issue: Validation errors
**Solution**: Install required packages:
```bash
npm install class-validator class-transformer
```

## 🎓 Additional Resources

- TypeORM Documentation: https://typeorm.io
- NestJS Documentation: https://docs.nestjs.com
- Swagger/OpenAPI: https://swagger.io

## ✨ Features to Implement Next

Consider adding:
- [ ] Calculator templates library
- [ ] Version history for calculators
- [ ] User analytics & tracking
- [ ] A/B testing for calculators
- [ ] Multi-language support
- [ ] Custom CSS injection
- [ ] Conditional page routing
- [ ] File upload fields
- [ ] Payment integrations

## 🤝 Support

For issues or questions:
1. Check the README.md in src/calculators/
2. Review Swagger documentation
3. Check TypeORM/NestJS documentation
4. Review the code comments

---

**Status**: ✅ Ready to use
**Version**: 1.0.0
**Last Updated**: 2026-03-05
