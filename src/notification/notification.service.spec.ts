import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { NotificationService } from './notification.service';
import { NotificationType, NotificationStatus } from './notification.enums';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationModel: any;

  beforeEach(async () => {
    mockNotificationModel = jest.fn();
    mockNotificationModel.findOneAndUpdate = jest.fn();
    mockNotificationModel.deleteMany = jest.fn();

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

  describe('createNotification', () => {
    it('should create a birthday notification', async () => {
      const userId = new Types.ObjectId();
      const nextRunAt = new Date();
      const mockNotification = { save: jest.fn().mockResolvedValue({}) };
      (mockNotificationModel as any).mockReturnValue(mockNotification);

      await service.createNotification(userId, nextRunAt);

      expect(mockNotificationModel).toHaveBeenCalledWith({
        userId,
        type: NotificationType.BIRTHDAY,
        status: NotificationStatus.PENDING,
        nextRunAt,
        audit: { createdAt: expect.any(Date) },
      });
      expect(mockNotification.save).toHaveBeenCalled();
    });
  });

  describe('updateNotification', () => {
    it('should update notification nextRunAt', async () => {
      const userId = new Types.ObjectId();
      const nextRunAt = new Date();

      await service.updateNotification(userId, nextRunAt);

      expect(mockNotificationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId },
        { nextRunAt, audit: { updatedAt: expect.any(Date) } },
      );
    });
  });

  describe('removeNotificationsByUser', () => {
    it('should remove all notifications for a user', async () => {
      const userId = 'userId';

      await service.removeNotificationsByUser(userId);

      expect(mockNotificationModel.deleteMany).toHaveBeenCalledWith({ userId });
    });
  });
});
