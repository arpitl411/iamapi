import { Test, TestingModule } from '@nestjs/testing';
import { RolesPermissionService } from './roles-permission.service';

describe('RolesPermissionService', () => {
  let service: RolesPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesPermissionService],
    }).compile();

    service = module.get<RolesPermissionService>(RolesPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
