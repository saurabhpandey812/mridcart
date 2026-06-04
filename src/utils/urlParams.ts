import type { SortOption } from '../types';

const VALID_SORTS: SortOption[] = [
  'price-asc',
  'price-desc',
  'title-asc',
  'title-desc',
];

export function parseCategoryIds(param: string | null): number[] {
  if (!param) return [];
  return param
    .split(',')
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !Number.isNaN(id) && id > 0);
}

export function parseSort(param: string | null): SortOption {
  if (param && VALID_SORTS.includes(param as SortOption)) {
    return param as SortOption;
  }
  return 'title-asc';
}

export function buildSearchParams(
  categories: number[],
  sort: SortOption
): string {
  const params = new URLSearchParams();
  if (categories.length > 0) {
    params.set('categories', categories.join(','));
  }
  if (sort !== 'title-asc') {
    params.set('sort', sort);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
