import { Test, TestingModule } from '@nestjs/testing';
import { RolesPermissionController } from './roles-permission.controller';

describe('RolesPermissionController', () => {
  let controller: RolesPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesPermissionController],
    }).compile();

    controller = module.get<RolesPermissionController>(RolesPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
