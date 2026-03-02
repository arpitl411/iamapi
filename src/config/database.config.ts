import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { CustomConfigService } from 'utils/db-config/custom-config.service';

export async function getDBConfig(
  configService: CustomConfigService,
): Promise<TypeOrmModuleOptions> {
  const sslEnabled = await configService.get<boolean>('SSL_MODE', false);

  const host = await configService.get<string>('DB_HOST');
  const port = Number(await configService.get<number>('DB_PORT'));
  const username = await configService.get<string>('DB_USERNAME');
  const password = await configService.get<string>('DB_PASSWORD');
  const database = await configService.get<string>('DB_NAME');

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [join(__dirname, '../../db-schema/**/*.entity{.ts,.js}')],
    synchronize: await configService.get<boolean>('DB_SYNCHRONIZE', false),
    logging: await configService.get<boolean>('DB_LOGGING', false),
    ssl: sslEnabled
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  };
}
