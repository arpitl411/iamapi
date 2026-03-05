import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/app.constants';

/**
 * Mark a route as public — skips JwtAuthGuard.
 *
 * Usage: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
