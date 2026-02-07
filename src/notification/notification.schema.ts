import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType, NotificationStatus } from './notification.enums';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, enum: NotificationStatus, required: true, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Prop({ required: true })
  nextRunAt: Date;

  @Prop({ type: Object })
  audit: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);