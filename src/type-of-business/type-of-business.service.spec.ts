import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfBusinessService } from './type-of-business.service';

describe('TypeOfBusinessService', () => {
  let service: TypeOfBusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfBusinessService],
    }).compile();

    service = module.get<TypeOfBusinessService>(TypeOfBusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
