import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { NotificationService } from '../notification/notification.service';
import { DateTime } from 'luxon';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockUserModel = jest.fn();
    mockUserModel.findById = jest.fn();
    mockUserModel.findByIdAndUpdate = jest.fn();
    mockUserModel.findByIdAndDelete = jest.fn();

    mockNotificationService = {
      createNotification: jest.fn(),
      updateNotification: jest.fn(),
      removeNotificationsByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and schedule notification', async () => {
      const dto = { firstName: 'John', lastName: 'Doe', location: 'NY', dateOfEvent: '1990-01-01' };
      const mockUser = { ...dto, _id: 'mockId', dateOfEvent: new Date(dto.dateOfEvent), save: jest.fn().mockResolvedValue({ ...dto, _id: 'mockId', dateOfEvent: new Date(dto.dateOfEvent) }) };
      (mockUserModel as any).mockReturnValue(mockUser);

      const result = await service.create(dto);

      expect(mockUserModel).toHaveBeenCalledWith({ ...dto, dateOfEvent: new Date(dto.dateOfEvent) });
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockNotificationService.createNotification).toHaveBeenCalledWith('mockId', expect.any(Date));
      expect(result).toEqual({ ...dto, _id: 'mockId', dateOfEvent: new Date(dto.dateOfEvent) });
    });
  });

  describe('update', () => {
    it('should update a user and reschedule notification', async () => {
      const existingUser = { _id: 'userId', firstName: 'John', lastName: 'Doe', location: 'NY', dateOfEvent: new Date('1990-01-01') };
      const updateDto = { firstName: 'Jane', dateOfEvent: '1991-02-02' };
      const updatedUser = { ...existingUser, ...updateDto, dateOfEvent: new Date('1991-02-02') };

      mockUserModel.findById.mockResolvedValue(existingUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update('userId', updateDto);

      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', { ...updateDto, dateOfEvent: new Date('1991-02-02') }, { new: true });
      expect(mockNotificationService.updateNotification).toHaveBeenCalledWith('userId', expect.any(Date));
      expect(result).toBe(updatedUser);
    });
    it('should update a user and reschedule when only location is provided', async () => {
      const updateDto = { location: 'Los Angeles' };
      const existingUser = { _id: 'userId', firstName: 'John', lastName: 'Doe', location: 'New York', dateOfEvent: new Date('1990-08-20') };
      const updatedUser = { ...existingUser, ...updateDto, dateOfEvent: new Date('1990-08-20') };

      mockUserModel.findById.mockResolvedValue(existingUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update('userId', updateDto);

      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', { ...updateDto, dateOfEvent: new Date('1990-08-20') }, { new: true });
      expect(mockNotificationService.updateNotification).toHaveBeenCalledWith('userId', expect.any(Date));
      expect(result).toBe(updatedUser);
    });
    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.update('userId', { firstName: 'Jane' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user and notifications', async () => {
      const existingUser = { _id: 'userId', firstName: 'John' };

      mockUserModel.findById.mockResolvedValue(existingUser);
      mockUserModel.findByIdAndDelete.mockResolvedValue(existingUser);

      await service.remove('userId');

      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(mockNotificationService.removeNotificationsByUser).toHaveBeenCalledWith('userId');
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('userId');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.remove('userId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateNextBirthday', () => {
    it('should calculate next birthday in current year if not passed', () => {
      const mockNow = DateTime.fromISO('2023-06-15T00:00:00Z');
      jest.spyOn(DateTime, 'now').mockReturnValue(mockNow);

      const service = new UserService(mockUserModel, mockNotificationService);
      const result = (service as any).calculateNextBirthday('1990-08-20');

      expect(result.getTime()).toBe(new Date('2023-08-20T00:00:00Z').getTime());
      jest.restoreAllMocks();
    });

    it('should calculate next birthday in next year if already passed', () => {
      const mockNow = DateTime.fromISO('2023-10-15T00:00:00Z');
      jest.spyOn(DateTime, 'now').mockReturnValue(mockNow);

      const service = new UserService(mockUserModel, mockNotificationService);
      const result = (service as any).calculateNextBirthday('1990-08-20');

      expect(result.getTime()).toBe(new Date('2024-08-20T00:00:00Z').getTime());
      jest.restoreAllMocks();
    });

    it('should handle leap year birthdays', () => {
      const mockNow = DateTime.fromISO('2023-02-28T00:00:00Z');
      jest.spyOn(DateTime, 'now').mockReturnValue(mockNow);

      const service = new UserService(mockUserModel, mockNotificationService);
      const result = (service as any).calculateNextBirthday('1992-02-29');

      expect(result.getTime()).toBe(new Date('2024-02-29T00:00:00Z').getTime());
      jest.restoreAllMocks();
    });

    it('should handle February 29 in non-leap year', () => {
      const mockNow = DateTime.fromISO('2023-02-28T00:00:00Z');
      jest.spyOn(DateTime, 'now').mockReturnValue(mockNow);

      const service = new UserService(mockUserModel, mockNotificationService);
      const result = (service as any).calculateNextBirthday('1990-02-29');

      expect(result.getTime()).toBe(new Date('2024-02-29T00:00:00Z').getTime());
      jest.restoreAllMocks();
    });
  });
});
