import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('notifications') private notificationsQueue: Queue) {}

  async onModuleInit() {
    // Event listeners for job completion and failure
    this.notificationsQueue.on('completed' as any, (job: any) => {
      this.logger.log(`Job ${job.id} completed successfully`);
    });

    this.notificationsQueue.on('failed' as any, (job: any, err: any) => {
      this.logger.error(`Job ${job.id} failed with error: ${err.message}`);
    });

    this.logger.log('Queue event listeners configured');
  }
}