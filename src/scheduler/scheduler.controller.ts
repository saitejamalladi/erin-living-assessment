import { Controller, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('trigger')
  async triggerProcessing(): Promise<{ message: string }> {
    await this.schedulerService.triggerProcessDueNotifications();
    return { message: 'Scheduler processing triggered manually' };
  }
}