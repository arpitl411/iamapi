import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * Serialize an entity or array of entities into a response DTO.
 * Strips all fields not decorated with @Expose() and removes null values.
 *
 * Usage:
 *   serialize(UserResponseDto, user)          → UserResponseDto
 *   serialize(UserResponseDto, [u1, u2])      → UserResponseDto[]
 */
export function serialize<T>(dto: ClassConstructor<T>, data: unknown[]): T[];
export function serialize<T>(dto: ClassConstructor<T>, data: unknown): T;
export function serialize<T>(
  dto: ClassConstructor<T>,
  data: unknown | unknown[],
): T | T[] {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true, // only @Expose() fields pass through
    exposeUnsetFields: false, // skip undefined fields
  }) as T | T[];
}
