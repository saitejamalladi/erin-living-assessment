import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as cron from 'node-cron';
import { Notification, NotificationDocument } from '../notification/notification.schema';
import { NotificationStatus } from '../notification/notification.enums';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {
    this.startScheduler();
  }

  private startScheduler(): void {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      this.logger.log('Running scheduled task to check for due notifications');
      await this.processDueNotifications();
    });

    this.logger.log('Scheduler started - will check for due notifications every 15 minutes');
  }

  // Manual trigger for testing purposes
  async triggerProcessDueNotifications(): Promise<void> {
    this.logger.log('Manually triggering due notifications processing');
    await this.processDueNotifications();
  }

  private async processDueNotifications(): Promise<void> {
    try {
      const now = new Date();

      // Find notifications that are due (PENDING status and nextRunAt <= now)
      const dueNotifications = await this.notificationModel
        .find({
          status: NotificationStatus.PENDING,
          nextRunAt: { $lte: now },
        })
        .exec();

      this.logger.log(`Found ${dueNotifications.length} due notifications to process`);

      for (const notification of dueNotifications) {
        await this.processNotification(notification);
      }
    } catch (error) {
      this.logger.error('Error processing due notifications', error);
    }
  }

  private async processNotification(notification: NotificationDocument): Promise<void> {
    try {
      // Attempt atomic update to PROCESSING status
      const updatedNotification = await this.notificationModel
        .findOneAndUpdate(
          {
            _id: notification._id,
            status: NotificationStatus.PENDING, // Only update if still PENDING
          },
          {
            status: NotificationStatus.PROCESSING,
            audit: {
              ...notification.audit,
              processingStartedAt: new Date(),
            },
          },
          { new: true }
        )
        .exec();

      if (!updatedNotification) {
        // Another instance already processed this notification
        this.logger.debug(`Notification ${notification._id} already being processed by another instance`);
        return;
      }

      // Add job to queue
      await this.notificationsQueue.add(
        'send-notification',
        {
          notificationId: notification._id.toString(),
          userId: notification.userId.toString(),
          type: notification.type,
        },
        {
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );

      this.logger.log(`Queued notification ${notification._id} for user ${notification.userId}`);
    } catch (error) {
      this.logger.error(`Error processing notification ${notification._id}`, error);
    }
  }
}