import { PaginationOptions } from '../interfaces/paginated.interface';

/**
 * Convert page/limit query params to TypeORM skip/take values.
 */
export const getPaginationOptions = (
  options: PaginationOptions,
): { skip: number; take: number } => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};
