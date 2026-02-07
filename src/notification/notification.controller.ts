import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Types } from 'mongoose';

class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID for the notification',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Next run timestamp (ISO date string)',
    example: '2024-01-01T09:00:00.000Z',
  })
  @IsDateString()
  nextRunAt!: Date;
}

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification schedule' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
    await this.notificationService.createNotification(
      new Types.ObjectId(createNotificationDto.userId),
      createNotificationDto.nextRunAt
    );
    return { message: 'Notification created' };
  }
}