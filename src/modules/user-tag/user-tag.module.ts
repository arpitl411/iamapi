// src/modules/user-tag/user-tag.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserTagService } from './user-tag.service';
import { UserTagController } from './user-tag.controller';
import { UserTag } from 'db-schema/user-tag.entity';
import { Tag } from 'db-schema/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTag, Tag]),
  ],
  controllers: [UserTagController],
  providers: [UserTagService],
  exports: [UserTagService], // export if used in other modules
})
export class UserTagModule {}
