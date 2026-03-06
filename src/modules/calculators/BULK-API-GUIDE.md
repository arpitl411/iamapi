# Calculator Bulk API Documentation

## Overview

The calculator module now supports **bulk operations** to reduce the number of API calls when creating, updating, and publishing calculators. Instead of making separate API calls for pages, sections, fields, formulas, rules, integrations, and design, you can now handle everything in a single API call.

## Key Features

✅ **Save Draft in One Go** - Create/update calculator with all components in a single transaction  
✅ **Publish with Validation** - Validate and publish calculator in one operation  
✅ **Atomic Transactions** - All operations happen in a database transaction (all or nothing)  
✅ **Nested Data Structure** - Send pages → sections → fields in a hierarchical structure  

---

## Endpoints

### 1. Create Calculator (Bulk Save Draft)

**Endpoint:** `POST /api/v1/organizations/:orgId/calculators/bulk`

**Description:** Create a new calculator with all its components (pages, sections, fields, formulas, rules, integrations, design) in one request. The calculator is saved as a draft.

**Request Body:**
```json
{
  "name": "Insurance Premium Calculator",
  "description": "Calculate insurance premiums based on coverage and age",
  "category": "INSURANCE",
  "pages": [
    {
      "title": "Personal Information",
      "order": 1,
      "isResultPage": false,
      "sections": [
        {
          "name": "Basic Details",
          "order": 1,
          "columns": 2,
          "fields": [
            {
              "type": "NUMBER",
              "label": "Age",
              "variableName": "user_age",
              "placeholder": "Enter your age",
              "required": true,
              "order": 1,
              "min": 18,
              "max": 100,
              "defaultValue": "25"
            },
            {
              "type": "DROPDOWN",
              "label": "Coverage Type",
              "variableName": "coverage_type",
              "required": true,
              "order": 2,
              "options": ["Basic", "Standard", "Premium"]
            }
          ]
        }
      ]
    },
    {
      "title": "Results",
      "order": 2,
      "isResultPage": true,
      "sections": [
        {
          "name": "Premium Calculation",
          "order": 1,
          "columns": 1,
          "fields": [
            {
              "type": "RESULT_DISPLAY",
              "label": "Monthly Premium",
              "variableName": "monthly_premium",
              "prefix": "$",
              "suffix": "per month"
            }
          ]
        }
      ]
    }
  ],
  "formulas": [
    {
      "name": "Calculate Monthly Premium",
      "outputVariable": "monthly_premium",
      "type": "STEP",
      "steps": [
        {
          "operand1": "user_age",
          "operator": "*",
          "operand2": "2.5"
        },
        {
          "operand1": "coverage_amount",
          "operator": "/",
          "operand2": "100"
        }
      ]
    }
  ],
  "rules": [
    {
      "name": "Adult Age Validation",
      "order": 1,
      "conditions": [
        {
          "field": "user_age",
          "operator": "GREATER_THAN",
          "value": 18
        }
      ],
      "actions": [
        {
          "type": "EXECUTE_FORMULA",
          "target": "monthly_premium"
        }
      ],
      "scope": "ON_CHANGE",
      "isActive": true
    }
  ],
  "integrations": [
    {
      "name": "Send to CRM",
      "type": "WEBHOOK",
      "url": "https://api.example.com/webhooks/calculator",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123"
      },
      "payloadMapping": {
        "user_age": "age",
        "monthly_premium": "premium"
      },
      "triggerOn": "ON_SUBMIT",
      "isActive": true
    }
  ],
  "design": {
    "primaryColor": "#6366f1",
    "backgroundColor": "#ffffff",
    "fontFamily": "DM Sans",
    "fontSize": "MEDIUM",
    "borderRadius": 8,
    "buttonColor": "#6366f1",
    "buttonTextColor": "#ffffff",
    "buttonSize": "MEDIUM",
    "buttonWidth": "AUTO"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "calc-uuid",
    "name": "Insurance Premium Calculator",
    "status": "DRAFT",
    "pages": [...],
    "formulas": [...],
    "rules": [...],
    "integrations": [...],
    "design": {...}
  },
  "message": "Calculator saved as draft successfully"
}
```

---

### 2. Update Calculator (Bulk Update Draft)

**Endpoint:** `PUT /api/v1/organizations/:orgId/calculators/:id/bulk`

**Description:** Update an existing calculator with all its components in one request. You can:
- Add new items (don't include `id` field)
- Update existing items (include `id` field with updates)
- Delete items (include `id` and `_delete: true`)

**Request Body:**
```json
{
  "name": "Updated Calculator Name",
  "description": "Updated description",
  "pages": [
    {
      "id": "existing-page-id",
      "title": "Updated Page Title",
      "sections": [
        {
          "id": "existing-section-id",
          "name": "Updated Section Name",
          "fields": [
            {
              "id": "existing-field-id",
              "label": "Updated Label"
            },
            {
              "type": "TEXT",
              "label": "New Field",
              "variableName": "new_field"
            },
            {
              "id": "field-to-delete-id",
              "_delete": true
            }
          ]
        },
        {
          "name": "New Section",
          "columns": 1,
          "fields": []
        }
      ]
    },
    {
      "id": "page-to-delete-id",
      "_delete": true
    }
  ],
  "formulas": [
    {
      "id": "existing-formula-id",
      "name": "Updated Formula Name"
    },
    {
      "name": "New Formula",
      "outputVariable": "new_output",
      "type": "STEP",
      "steps": []
    }
  ],
  "rules": [...],
  "integrations": [...],
  "design": {...}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "calc-uuid",
    "name": "Updated Calculator Name",
    "status": "DRAFT",
    ...
  },
  "message": "Calculator draft updated successfully"
}
```

---

### 3. Publish Calculator (Bulk Publish)

**Endpoint:** `POST /api/v1/organizations/:orgId/calculators/:id/publish`

**Description:** Validate and publish the calculator. This endpoint:
- Validates that the calculator has at least one page
- Validates that there's at least one input field
- Validates that there's at least one result page
- Updates the calculator status to PUBLISHED
- Creates/updates the publish record with publish timestamp

**Request:** No body required

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "calc-uuid",
    "name": "Insurance Premium Calculator",
    "status": "PUBLISHED",
    ...
  },
  "message": "Calculator published successfully"
}
```

**Response (Validation Failed):**
```json
{
  "success": false,
  "message": "Calculator validation failed",
  "errors": [
    "Calculator must have at least one page",
    "Calculator must have at least one input field",
    "Calculator must have at least one result page"
  ]
}
```

---

## Migration Guide

### Before (Multiple API Calls)

```typescript
// ❌ OLD WAY - Too many API calls
const calculator = await createCalculator(orgId, { name, description, category });
const page = await createPage(calculator.id, { title: "Page 1" });
const section = await createSection(page.id, { name: "Section 1" });
const field1 = await createField(section.id, { type: "TEXT", label: "Field 1" });
const field2 = await createField(section.id, { type: "NUMBER", label: "Field 2" });
const formula = await createFormula(calculator.id, { name: "Formula 1", ... });
const rule = await createRule(calculator.id, { name: "Rule 1", ... });
const design = await createDesign(calculator.id, { primaryColor: "#6366f1", ... });
// ... and so on
await publishCalculator(calculator.id);
```

### After (Single Bulk API Call)

```typescript
// ✅ NEW WAY - One API call for draft
const calculator = await bulkCreateCalculator(orgId, {
  name,
  description,
  category,
  pages: [{
    title: "Page 1",
    sections: [{
      name: "Section 1",
      fields: [
        { type: "TEXT", label: "Field 1", variableName: "field_1" },
        { type: "NUMBER", label: "Field 2", variableName: "field_2" }
      ]
    }]
  }],
  formulas: [{ name: "Formula 1", ... }],
  rules: [{ name: "Rule 1", ... }],
  design: { primaryColor: "#6366f1", ... }
});

// ✅ One API call to publish
await bulkPublishCalculator(orgId, calculator.id);
```

---

## Benefits

1. **Reduced Network Overhead** - From 10+ API calls to just 1-2 calls
2. **Faster Performance** - Single database transaction is much faster
3. **Data Consistency** - Atomic operations ensure all-or-nothing saves
4. **Simplified Error Handling** - One error response instead of tracking multiple
5. **Better UX** - Instant save/publish without waiting for multiple requests

---

## Notes

- All operations are wrapped in database transactions for atomicity
- If any part of the operation fails, the entire transaction is rolled back
- The `tempId` field in fields can be used to cross-reference fields in formulas/rules during creation
- When updating, omit the `id` field to create new items
- Use `_delete: true` to mark items for deletion
- Variable names must be unique within a calculator and follow snake_case format

---

## Example Frontend Implementation

```typescript
// Save draft button handler
async function handleSaveDraft() {
  const calculatorData = {
    name: formData.name,
    description: formData.description,
    category: formData.category,
    pages: pages.map(page => ({
      ...page,
      sections: page.sections.map(section => ({
        ...section,
        fields: section.fields
      }))
    })),
    formulas: formulas,
    rules: rules,
    integrations: integrations,
    design: designSettings
  };

  try {
    if (calculatorId) {
      // Update existing
      await api.put(`/organizations/${orgId}/calculators/${calculatorId}/bulk`, calculatorData);
    } else {
      // Create new
      const response = await api.post(`/organizations/${orgId}/calculators/bulk`, calculatorData);
      setCalculatorId(response.data.id);
    }
    toast.success('Draft saved successfully!');
  } catch (error) {
    toast.error('Failed to save draft');
  }
}

// Publish button handler
async function handlePublish() {
  try {
    await api.post(`/organizations/${orgId}/calculators/${calculatorId}/publish`);
    toast.success('Calculator published successfully!');
  } catch (error) {
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.join(', ');
      toast.error(`Validation failed: ${errorMessages}`);
    } else {
      toast.error('Failed to publish calculator');
    }
  }
}
```

---

## Field Types Reference

Available field types:
- `TEXT` - Text input
- `NUMBER` - Numeric input
- `EMAIL` - Email input
- `DROPDOWN` - Dropdown select (requires `options`)
- `RADIO` - Radio buttons (requires `options`)
- `CHECKBOX` - Checkboxes (requires `options`)
- `TEXTAREA` - Multi-line text
- `SLIDER` - Range slider (requires `min`, `max`, `step`)
- `DATE` - Date picker
- `RESULT_DISPLAY` - Display calculated result

---

## Status

✅ Implementation Complete  
✅ Error Handling Added  
✅ Validation Implemented  
✅ Transaction Support  
✅ Documentation Complete  
