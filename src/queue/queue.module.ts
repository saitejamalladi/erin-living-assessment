import { Module, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 5000, // 5 seconds
        },
      },
      // Note: Limiter configuration may need to be set via queue instance
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}