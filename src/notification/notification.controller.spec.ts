import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockNotificationService = {
      createNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const dto = { userId: '507f1f77bcf86cd799439011', nextRunAt: new Date() };
      mockNotificationService.createNotification.mockResolvedValue(undefined);

      const result = await controller.create(dto);

      expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
        expect.any(Object), // Types.ObjectId
        dto.nextRunAt
      );
      expect(result).toEqual({ message: 'Notification created' });
    });
  });
});