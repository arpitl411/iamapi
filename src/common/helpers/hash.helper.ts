import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants/app.constants';

/**
 * Hash a plain-text password.
 */
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

/**
 * Compare a plain-text password against a hash.
 */
export const comparePassword = (
  plain: string,
  hashed: string,
): Promise<boolean> => bcrypt.compare(plain, hashed);
