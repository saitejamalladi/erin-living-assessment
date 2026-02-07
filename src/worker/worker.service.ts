import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Notification, NotificationDocument } from '../notification/notification.schema';
import { User, UserDocument } from '../user/user.schema';
import { NotificationStatus, NotificationType } from '../notification/notification.enums';
import { DateTime } from 'luxon';

@Injectable()
@Processor('notifications')
export class WorkerService extends WorkerHost {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    const { notificationId, userId, type } = job.data;

    this.logger.log(`Processing notification job: ${job.id} for notification ${notificationId}`);

    let notification: NotificationDocument | null = null;

    try {
      // Fetch notification and user data
      notification = await this.notificationModel.findById(notificationId).exec();
      if (!notification) {
        throw new Error(`Notification ${notificationId} not found`);
      }

      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // Construct message based on notification type
      let message: string;
      if (type === NotificationType.BIRTHDAY) {
        message = `Happy Birthday, ${user.firstName} ${user.lastName}!`;
      } else {
        message = `Notification for ${user.firstName} ${user.lastName}`;
      }

      // Send HTTP POST request to RequestBin
      const requestBinUrl = process.env.REQUEST_BIN_URL || 'https://httpbin.org/post';
      const payload = {
        message,
        userId: user._id.toString(),
        notificationId: notification._id.toString(),
        type,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(requestBinUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP request failed with status ${response.status}`);
      }

      // Calculate next run date (add 1 year for birthday notifications)
      let nextRunAt: Date;
      if (type === NotificationType.BIRTHDAY) {
        const currentDate = DateTime.fromJSDate(notification.nextRunAt);
        nextRunAt = currentDate.plus({ years: 1 }).toJSDate();
      } else {
        // For other types, you might want different logic
        nextRunAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year
      }

      // Update notification status to SCHEDULED and set next run date
      await this.notificationModel.findByIdAndUpdate(notificationId, {
        status: NotificationStatus.SCHEDULED,
        nextRunAt,
        audit: {
          ...notification.audit,
          lastSentAt: new Date(),
          sentCount: (notification.audit?.sentCount || 0) + 1,
        },
      }).exec();

      this.logger.log(`Successfully processed notification ${notificationId} for user ${userId}`);

    } catch (error) {
      this.logger.error(`Failed to process notification ${notificationId}`, error);

      // Update notification status to FAILED
      await this.notificationModel.findByIdAndUpdate(notificationId, {
        status: NotificationStatus.FAILED,
        audit: {
          ...(notification?.audit || {}),
          lastFailedAt: new Date(),
          failureReason: error instanceof Error ? error.message : String(error),
          failureCount: ((notification?.audit?.failureCount || 0) + 1),
        },
      }).exec();

      throw error; // Re-throw to let BullMQ handle retries
    }
  }
}