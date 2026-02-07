import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Types } from 'mongoose';

class CreateNotificationDto {
  userId!: string;
  nextRunAt!: Date;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
    await this.notificationService.createNotification(
      new Types.ObjectId(createNotificationDto.userId),
      createNotificationDto.nextRunAt
    );
    return { message: 'Notification created' };
  }
}