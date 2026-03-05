import {
  FiltersOptions,
  PaginationMetadata,
  SortOptions,
} from 'src/interface/common.interface';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyPagination<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number,
  limit: number,
  table: string,
  sort?: SortOptions,
): PaginationMetadata {
  const offset = (page - 1) * limit;

  queryBuilder.skip(offset).take(limit);
  if (typeof sort === 'string') {
    sort = JSON.parse(sort);
  }

  if (sort && Array.isArray(sort) && sort.length > 0) {
    sort.forEach((sortOption, index) => {
      if (sortOption.field) {
        if (index === 0) {
          queryBuilder.orderBy(
            `${table}.${sortOption.field}`,
            sortOption.order,
          );
        } else {
          queryBuilder.addOrderBy(
            `${table}.${sortOption.field}`,
            sortOption.order,
          );
        }
      }
    });
  }

  return {
    currentPage: page,
    totalPages: 0,
    totalItems: 0,
  };
}

export function advancedSearch<T extends ObjectLiteral>(
  queryBuilderAdvance: SelectQueryBuilder<T>,
  filters: FiltersOptions,
  search: string,
  isFirstConditionInWhere: boolean,
) {
  Object.entries(filters).forEach(([field, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (isFirstConditionInWhere) {
            queryBuilderAdvance.where(`${field}.${val} LIKE :${val}`, {
              [`${val}`]: `%${search}%`,
            });
            isFirstConditionInWhere = false;
          } else {
            queryBuilderAdvance.orWhere(`${field}.${val} LIKE :${val}`, {
              [`${val}`]: `%${search}%`,
            });
          }
        });
      } else {
        console.log('Sorry not proceed');
      }
    }
  });
}
