import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockNotificationModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken('Notification'),
          useValue: mockNotificationModel,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    const userId = 'userId';
    const nextRunAt = new Date();
    const mockNotification = { save: jest.fn().mockResolvedValue({}) };
    mockNotificationModel.mockReturnValue(mockNotification);
    await service.createNotification(userId as any, nextRunAt);
    expect(mockNotification.save).toHaveBeenCalled();
  });
});
