import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  @ApiResponse({ status: 503, description: 'Application is unhealthy' })
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
