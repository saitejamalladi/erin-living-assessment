import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('HealthController', () => {
  let controller: HealthController;

  const mockConnection = {
    db: {
      admin: jest.fn().mockReturnValue({
        ping: jest.fn().mockResolvedValue(true),
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    })
      .useMocker((token) => {
        if (token === getConnectionToken()) {
          return mockConnection;
        }
      })
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', async () => {
    const result = await controller.checkHealth();
    expect(result).toEqual({ status: 'ok', database: 'connected' });
  });
});
