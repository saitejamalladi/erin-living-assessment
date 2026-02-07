import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

describe('SchedulerController', () => {
  let controller: SchedulerController;
  let mockSchedulerService: any;

  beforeEach(async () => {
    mockSchedulerService = {
      triggerProcessDueNotifications: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulerController],
      providers: [
        {
          provide: SchedulerService,
          useValue: mockSchedulerService,
        },
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trigger', () => {
    it('should trigger processing and return success message', async () => {
      mockSchedulerService.triggerProcessDueNotifications.mockResolvedValue(undefined);

      const result = await controller.triggerProcessing();

      expect(mockSchedulerService.triggerProcessDueNotifications).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Scheduler processing triggered manually' });
    });
  });
});