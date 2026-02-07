import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';

@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Manually trigger scheduler processing' })
  @ApiResponse({ status: 200, description: 'Scheduler processing triggered successfully' })
  async triggerProcessing(): Promise<{ message: string }> {
    await this.schedulerService.triggerProcessDueNotifications();
    return { message: 'Scheduler processing triggered manually' };
  }
}