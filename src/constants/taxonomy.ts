// Taxonomy constants for consistent data across the platform

export const COUNTRIES = [
  { value: 'EG', ar: 'مصر', en: 'Egypt' },
  { value: 'SA', ar: 'السعودية', en: 'Saudi Arabia' },
  { value: 'AE', ar: 'الإمارات', en: 'UAE' },
  { value: 'QA', ar: 'قطر', en: 'Qatar' },
  { value: 'KW', ar: 'الكويت', en: 'Kuwait' },
  { value: 'BH', ar: 'البحرين', en: 'Bahrain' },
  { value: 'OM', ar: 'عمان', en: 'Oman' },
  { value: 'JO', ar: 'الأردن', en: 'Jordan' },
  { value: 'LB', ar: 'لبنان', en: 'Lebanon' },
  { value: 'IQ', ar: 'العراق', en: 'Iraq' },
] as const

export const CATEGORIES = [
  { value: 'technology', ar: 'تكنولوجيا المعلومات', en: 'Technology' },
  { value: 'engineering', ar: 'هندسة', en: 'Engineering' },
  { value: 'marketing', ar: 'تسويق', en: 'Marketing' },
  { value: 'sales', ar: 'مبيعات', en: 'Sales' },
  { value: 'design', ar: 'تصميم', en: 'Design' },
  { value: 'finance', ar: 'مالية ومحاسبة', en: 'Finance' },
  { value: 'hr', ar: 'موارد بشرية', en: 'Human Resources' },
  { value: 'health', ar: 'صحة وطب', en: 'Healthcare' },
  { value: 'education', ar: 'تعليم', en: 'Education' },
  { value: 'legal', ar: 'قانون', en: 'Legal' },
  { value: 'operations', ar: 'عمليات', en: 'Operations' },
  { value: 'customer-service', ar: 'خدمة العملاء', en: 'Customer Service' },
] as const

export const JOB_TYPES = [
  { value: 'full-time', ar: 'دوام كامل', en: 'Full-time' },
  { value: 'part-time', ar: 'دوام جزئي', en: 'Part-time' },
  { value: 'contract', ar: 'عقد', en: 'Contract' },
  { value: 'remote', ar: 'عن بُعد', en: 'Remote' },
  { value: 'internship', ar: 'تدريب', en: 'Internship' },
] as const

// Helper functions
export function getCountryLabel(code: string, locale: 'ar' | 'en'): string {
  const country = COUNTRIES.find(c => c.value === code)
  return country ? country[locale] : code
}

export function getCategoryLabel(code: string, locale: 'ar' | 'en'): string {
  const category = CATEGORIES.find(c => c.value === code)
  return category ? category[locale] : code
}

export function getJobTypeLabel(code: string, locale: 'ar' | 'en'): string {
  const type = JOB_TYPES.find(t => t.value === code)
  return type ? type[locale] : code
}

// Type exports
export type CountryCode = typeof COUNTRIES[number]['value']
export type CategoryCode = typeof CATEGORIES[number]['value']
export type JobTypeCode = typeof JOB_TYPES[number]['value']
