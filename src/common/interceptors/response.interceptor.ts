import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import {
  ApiResponse,
  ResponseMeta,
} from '../interfaces/api-response.interface';

/**
 * Global response interceptor — wraps every successful response in:
 * { success, statusCode, message, data, meta?, timestamp, path }
 *
 * Services return ServiceResponse<T>: { message, data, meta? }
 * Interceptor builds the full ApiResponse<T> envelope automatically.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((result: unknown) => {
        const isObject = result && typeof result === 'object';

        const resultObj = isObject ? (result as Record<string, unknown>) : null;

        const message =
          resultObj && 'message' in resultObj
            ? String(resultObj['message'])
            : 'Success';

        const data =
          resultObj && 'data' in resultObj ? resultObj['data'] : result;

        const meta =
          resultObj && 'meta' in resultObj
            ? (resultObj['meta'] as ResponseMeta)
            : undefined;

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: (data ?? null) as T,
          ...(meta ? { meta } : {}),
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
