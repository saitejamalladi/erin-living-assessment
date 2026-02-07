import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WorkerService } from './worker.service';
import { Notification, NotificationDocument } from '../notification/notification.schema';
import { User, UserDocument } from '../user/user.schema';
import { NotificationStatus, NotificationType } from '../notification/notification.enums';
import { Model } from 'mongoose';

// Mock fetch globally
global.fetch = jest.fn();

describe('WorkerService', () => {
  let service: WorkerService;
  let notificationModel: Model<NotificationDocument>;
  let userModel: Model<UserDocument>;

  const mockNotification = {
    _id: 'notification-id',
    userId: 'user-id',
    type: NotificationType.BIRTHDAY,
    status: NotificationStatus.PROCESSING,
    nextRunAt: new Date(),
    audit: {},
    save: jest.fn(),
  };

  const mockUser = {
    _id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    location: 'New York',
    dateOfEvent: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: getModelToken(Notification.name),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    notificationModel = module.get<Model<NotificationDocument>>(getModelToken(Notification.name));
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    // Reset mocks
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('process', () => {
    it('should process birthday notification successfully', async () => {
      const job = {
        id: 'job-id',
        data: {
          notificationId: 'notification-id',
          userId: 'user-id',
          type: NotificationType.BIRTHDAY,
        },
      };

      const mockFindById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findById = mockFindById;

      const mockFindByIdUser = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      userModel.findById = mockFindByIdUser;

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });

      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await service.process(job as any);

      expect(mockFindById).toHaveBeenCalledWith('notification-id');
      expect(mockFindByIdUser).toHaveBeenCalledWith('user-id');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://httpbin.org/post',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"message":"Happy Birthday, John Doe!"'),
        }
      );
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('notification-id', {
        status: NotificationStatus.SCHEDULED,
        nextRunAt: expect.any(Date),
        audit: expect.objectContaining({
          lastSentAt: expect.any(Date),
          sentCount: 1,
        }),
      });
    });

    it('should handle notification not found', async () => {
      const job = {
        id: 'job-id',
        data: {
          notificationId: 'notification-id',
          userId: 'user-id',
          type: NotificationType.BIRTHDAY,
        },
      };

      const mockFindById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      notificationModel.findById = mockFindById;

      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await expect(service.process(job as any)).rejects.toThrow('Notification notification-id not found');

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('notification-id', {
        status: NotificationStatus.FAILED,
        audit: expect.objectContaining({
          lastFailedAt: expect.any(Date),
          failureReason: 'Notification notification-id not found',
          failureCount: 1,
        }),
      });
    });

    it('should handle user not found', async () => {
      const job = {
        id: 'job-id',
        data: {
          notificationId: 'notification-id',
          userId: 'user-id',
          type: NotificationType.BIRTHDAY,
        },
      };

      const mockFindById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findById = mockFindById;

      const mockFindByIdUser = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      userModel.findById = mockFindByIdUser;

      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await expect(service.process(job as any)).rejects.toThrow('User user-id not found');

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('notification-id', {
        status: NotificationStatus.FAILED,
        audit: expect.objectContaining({
          lastFailedAt: expect.any(Date),
          failureReason: 'User user-id not found',
          failureCount: 1,
        }),
      });
    });

    it('should handle HTTP request failure', async () => {
      const job = {
        id: 'job-id',
        data: {
          notificationId: 'notification-id',
          userId: 'user-id',
          type: NotificationType.BIRTHDAY,
        },
      };

      const mockFindById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findById = mockFindById;

      const mockFindByIdUser = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      userModel.findById = mockFindByIdUser;

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });
      notificationModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await expect(service.process(job as any)).rejects.toThrow('HTTP request failed with status 500');

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('notification-id', {
        status: NotificationStatus.FAILED,
        audit: expect.objectContaining({
          lastFailedAt: expect.any(Date),
          failureReason: 'HTTP request failed with status 500',
          failureCount: 1,
        }),
      });
    });
  });
});