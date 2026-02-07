import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = { firstName: 'John', lastName: 'Doe', location: 'NY', dateOfEvent: '1990-01-01' };
      const result = { ...dto, _id: 'userId' };
      mockUserService.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });

    it('should handle validation errors', async () => {
      const invalidDto = { firstName: '', location: '', dateOfEvent: 'invalid' };

      // Since ValidationPipe is used, it should throw BadRequestException
      // But in unit test, we can mock the service to throw
      mockUserService.create.mockRejectedValue(new BadRequestException());

      await expect(controller.create(invalidDto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const id = 'userId';
      const dto = { firstName: 'Jane' };
      const result = { _id: id, firstName: 'Jane', lastName: 'Doe' };
      mockUserService.update.mockResolvedValue(result);

      const response = await controller.update(id, dto);

      expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
      expect(response).toEqual(result);
    });

    it('should handle not found', async () => {
      mockUserService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalidId', { firstName: 'Jane' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('userId')).resolves.toBeUndefined();
      expect(mockUserService.remove).toHaveBeenCalledWith('userId');
    });

    it('should handle not found', async () => {
      mockUserService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});
