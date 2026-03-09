import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesPermissionModule } from './modules/roles-permission/roles-permission.module';
import { getDBConfig } from 'src/config/database.config';
import { CustomConfigModule } from 'utils/db-config/custom-config.module';
import { CustomConfigService } from 'utils/db-config/custom-config.service';
import appConfig from 'src/config/config';
import { UserTagModule } from './modules/user-tag/user-tag.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    // Config — load env vars and typed config factory
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
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

    // Feature modules
    AuthModule,
    RoleModule,
    PermissionModule,
    RolesPermissionModule,
    CategoriesModule
  ],
})
export class AppModule {}
