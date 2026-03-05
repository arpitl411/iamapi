export interface JwtPayload {
  sub: number;
  email: string;
  uuid?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: number;
  email: string;
  uuid?: string;
}
