export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface SortOption {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface FilterOption {
  field: string;
  operator: string;
  value: string;
}

export type SortOptions = SortOption[];

export type FiltersOptions = Record<string, string | string[]>;