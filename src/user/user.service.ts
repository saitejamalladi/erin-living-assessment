import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const nextRunAt = this.calculateNextBirthday(createUserDto.dateOfEvent);
    const user = new this.userModel({ ...createUserDto, dateOfEvent: new Date(createUserDto.dateOfEvent) });
    const savedUser = await user.save();
    await this.notificationService.createNotification(savedUser._id, nextRunAt);
    return savedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    let nextRunAt = user.dateOfEvent; // default
    if (updateUserDto.dateOfEvent || updateUserDto.location) {
      const date = updateUserDto.dateOfEvent || user.dateOfEvent.toISOString().split('T')[0];
      nextRunAt = this.calculateNextBirthday(date);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, { ...updateUserDto, dateOfEvent: new Date(updateUserDto.dateOfEvent || user.dateOfEvent) }, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    await this.notificationService.updateNotification(updatedUser._id, nextRunAt);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.notificationService.removeNotificationsByUser(id);
    await this.userModel.findByIdAndDelete(id);
  }

  private calculateNextBirthday(dateOfEvent: string): Date {
    const now = DateTime.now().setZone('UTC');
    const [yearStr, monthStr, dayStr] = dateOfEvent.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    let year = now.year;
    let nextBirthday = DateTime.fromObject({ year, month, day }, { zone: 'UTC' });

    // If the date is invalid (e.g., Feb 29 in non-leap year), find the next valid year
    while (!nextBirthday.isValid || nextBirthday < now) {
      year++;
      nextBirthday = DateTime.fromObject({ year, month, day }, { zone: 'UTC' });
    }

    return nextBirthday.toJSDate();
  }
}
