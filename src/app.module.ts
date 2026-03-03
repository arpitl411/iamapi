import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { getDBConfig } from 'src/config/database.config';
import { CustomConfigModule } from 'utils/db-config/custom-config.module';
import { CustomConfigService } from 'utils/db-config/custom-config.service';
import { AuthModule } from './modules/auth/auth.module';
import { RolesPermissionModule } from './modules/roles-permission/roles-permission.module';
import { UserTagModule } from './modules/user-tag/user-tag.module';

@Module({
  imports: [
    CustomConfigModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    RolesPermissionModule,
    UserTagModule,
    TypeOrmModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) =>
        getDBConfig(configService),
    }),
  ],
})
export class AppModule {}
