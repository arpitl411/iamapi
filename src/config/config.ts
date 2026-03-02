export default () => ({
  env: process.env.APP_ENV || 'development',
  port: parseInt(process.env.APP_PORT || '3000', 10),

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
      ? parseInt(process.env.DB_PORT, 10)
      : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    ssl: process.env.SSL_MODE === 'true',
  },

  keycloak: {
    authUrl: process.env.KEYCLOAK_AUTH_URL,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET,
  },

  gRPC: process.env.GRPC_URL || '0.0.0.0:50052',

  keycloak_user_email: process.env.KEYCLOAK_USER_EMAIL,
  keycloak_user_password: process.env.KEYCLOAK_USER_PASSWORD,
});
