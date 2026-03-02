import { Module } from '@nestjs/common';
import { RolesPermissionController } from './roles-permission.controller';
import { RolesPermissionService } from './roles-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'db-schema/user.entity';
import { UserPersona } from 'db-schema/user-persons.entity';
import { Role } from 'db-schema/role.entity';
import { RoleHasPermission } from 'db-schema/role-has-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPersona, Role, RoleHasPermission]),
  ],
  controllers: [RolesPermissionController],
  providers: [RolesPermissionService],
  exports:[RolesPermissionService]
})
export class RolesPermissionModule {}
