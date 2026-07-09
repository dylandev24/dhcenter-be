export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const PROPERTY_CATEGORY_MAP = {
  mat_bang: 'mat-bang',
  nha_dat: 'nha-dat',
  toa_nha: 'toa-nha',
  van_phong: 'van-phong',
} as const;

export const PROPERTY_CATEGORY_REVERSE = {
  'mat-bang': 'mat_bang',
  'nha-dat': 'nha_dat',
  'toa-nha': 'toa_nha',
  'van-phong': 'van_phong',
} as const;

export type PropertyCategoryApi =
  (typeof PROPERTY_CATEGORY_MAP)[keyof typeof PROPERTY_CATEGORY_MAP];

export function toPropertyCategoryApi(
  category: keyof typeof PROPERTY_CATEGORY_MAP,
): PropertyCategoryApi {
  return PROPERTY_CATEGORY_MAP[category];
}

export function fromPropertyCategoryApi(
  category: PropertyCategoryApi,
): keyof typeof PROPERTY_CATEGORY_MAP {
  return PROPERTY_CATEGORY_REVERSE[category];
}
