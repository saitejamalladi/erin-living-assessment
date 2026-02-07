import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { SchedulerService } from './scheduler.service';
import { Notification, NotificationDocument } from '../notification/notification.schema';
import { NotificationStatus } from '../notification/notification.enums';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let notificationModel: Model<NotificationDocument>;
  let notificationsQueue: any;

  const mockNotification = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    type: 'birthday',
    status: NotificationStatus.PENDING,
    nextRunAt: new Date(Date.now() - 1000), // Past date
    audit: {},
  };

  beforeEach(async () => {
    const mockNotificationModel = {
      find: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    const mockQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationModel,
        },
        {
          provide: getQueueToken('notifications'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    notificationModel = module.get<Model<NotificationDocument>>(getModelToken(Notification.name));
    notificationsQueue = module.get(getQueueToken('notifications'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDueNotifications', () => {
    it('should process due notifications', async () => {
      const mockFind = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockNotification]),
      });
      notificationModel.find = mockFind;

      const mockFindOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findOneAndUpdate = mockFindOneAndUpdate;

      const mockAdd = jest.fn().mockResolvedValue(undefined);
      notificationsQueue.add = mockAdd;

      // Access private method for testing
      await (service as any).processDueNotifications();

      expect(mockFind).toHaveBeenCalledWith({
        status: NotificationStatus.PENDING,
        nextRunAt: { $lte: expect.any(Date) },
      });

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        {
          _id: mockNotification._id,
          status: NotificationStatus.PENDING,
        },
        {
          status: NotificationStatus.PROCESSING,
          audit: expect.objectContaining({
            processingStartedAt: expect.any(Date),
          }),
        },
        { new: true }
      );

      expect(mockAdd).toHaveBeenCalledWith(
        'send-notification',
        {
          notificationId: mockNotification._id.toString(),
          userId: mockNotification.userId.toString(),
          type: mockNotification.type,
        },
        {
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );
    });

    it('should skip notifications already being processed', async () => {
      const mockFind = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockNotification]),
      });
      notificationModel.find = mockFind;

      const mockFindOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Simulate concurrent processing
      });
      notificationModel.findOneAndUpdate = mockFindOneAndUpdate;

      const mockAdd = jest.fn().mockResolvedValue(undefined);
      notificationsQueue.add = mockAdd;

      await (service as any).processDueNotifications();

      expect(mockFindOneAndUpdate).toHaveBeenCalled();
      expect(mockAdd).not.toHaveBeenCalled();
    });
  });
});