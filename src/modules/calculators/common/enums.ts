/**
 * Enums for Dynamic Calculators Feature
 */

export enum CalculatorCategory {
  INSURANCE = 'insurance',
  INVESTMENT = 'investment',
  TAX = 'tax',
  LOAN = 'loan',
  CALCULATOR = 'calculator',
  CUSTOM = 'custom',
}

export enum CalculatorStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum FieldType {
  NUMBER = 'number',
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  SLIDER = 'slider',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TOGGLE = 'toggle',
  TEXTAREA = 'textarea',
  RESULT_CARD = 'result_card',
  CHART = 'chart',
  SUMMARY_TEXT = 'summary_text',
}

export enum ResultFormat {
  CURRENCY_INR = 'currency_inr',
  CURRENCY_USD = 'currency_usd',
  PERCENTAGE = 'percentage',
  NUMBER = 'number',
  TEXT = 'text',
}

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  DONUT = 'donut',
  PIE = 'pie',
  AREA = 'area',
}

export enum FormulaType {
  STEP = 'step',
  ADVANCED = 'advanced',
}

export enum RuleOperator {
  EQUALS = 'equals',
  NOT_EQUAL = 'not_equal',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_OR_EQUAL = 'greater_or_equal',
  LESS_OR_EQUAL = 'less_or_equal',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
  IS_PRESENT = 'is_present',
}

export enum LogicOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum RuleActionType {
  EXECUTE_FORMULA = 'execute_formula',
  SET_VALUE = 'set_value',
  CALL_API = 'call_api',
  SHOW_ALERT = 'show_alert',
  SHOW_FIELD = 'show_field',
  HIDE_FIELD = 'hide_field',
}

export enum RuleScope {
  ON_CHANGE = 'on_change',
  ON_SUBMIT = 'on_submit',
  ON_LOAD = 'on_load',
}

export enum IntegrationType {
  WEBHOOK = 'webhook',
  REST_API = 'rest_api',
  CRM = 'crm',
  EMAIL = 'email',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum IntegrationTrigger {
  ON_SUBMIT = 'on_submit',
  ON_CHANGE = 'on_change',
  MANUAL = 'manual',
}

export enum FontSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum ButtonWidth {
  AUTO = 'auto',
  FULL = 'full',
}
