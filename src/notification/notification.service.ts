import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { NotificationType, NotificationStatus } from './notification.enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(userId: Types.ObjectId, nextRunAt: Date): Promise<void> {
    const notification = new this.notificationModel({
      userId,
      type: NotificationType.BIRTHDAY,
      status: NotificationStatus.PENDING,
      nextRunAt,
      audit: { createdAt: new Date() },
    });
    await notification.save();
  }

  async updateNotification(userId: Types.ObjectId, nextRunAt: Date): Promise<void> {
    await this.notificationModel.findOneAndUpdate(
      { userId },
      { nextRunAt, audit: { updatedAt: new Date() } },
    );
  }

  async removeNotificationsByUser(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId });
  }
}
