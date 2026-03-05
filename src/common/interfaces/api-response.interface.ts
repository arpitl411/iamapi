export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

/**
 * What SERVICES return — just the business data.
 * The interceptor adds the envelope fields (success, statusCode, timestamp, path).
 */
export interface ServiceResponse<T = unknown> {
  message: string;
  data: T | null;
  meta?: ResponseMeta;
}

/**
 * What the CLIENT receives — full HTTP response envelope.
 * Built by ResponseInterceptor from ServiceResponse.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: ResponseMeta;
  timestamp: string;
  path: string;
}
