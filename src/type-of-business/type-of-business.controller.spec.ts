import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfBusinessController } from './type-of-business.controller';
import { TypeOfBusinessService } from './type-of-business.service';

describe('TypeOfBusinessController', () => {
  let controller: TypeOfBusinessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfBusinessController],
      providers: [TypeOfBusinessService],
    }).compile();

    controller = module.get<TypeOfBusinessController>(TypeOfBusinessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
