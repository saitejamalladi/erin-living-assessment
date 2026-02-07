import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { NotificationService } from '../notification/notification.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    _id: 'mockId',
  }));

  const mockNotificationService = {
    createNotification: jest.fn(),
    updateNotification: jest.fn(),
    removeNotificationsByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { firstName: 'John', lastName: 'Doe', location: 'NY', dateOfEvent: '1990-01-01' };
    const mockUser = { ...dto, _id: 'mockId', save: jest.fn().mockResolvedValue({ ...dto, _id: 'mockId' }) };
    mockUserModel.mockReturnValue(mockUser);
    const result = await service.create(dto);
    expect(result).toEqual({ ...dto, _id: 'mockId' });
  });
});
