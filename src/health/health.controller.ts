import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  async checkHealth() {
    try {
      if (this.connection.db) {
        await this.connection.db.admin().ping();
        return { status: 'ok', database: 'connected' };
      } else {
        return { status: 'error', database: 'disconnected', error: 'Database not available' };
      }
    } catch (error) {
      return { status: 'error', database: 'disconnected', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
