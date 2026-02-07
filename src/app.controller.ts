import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIndex(): string {
    const indexPath = join(__dirname, '..', 'public', 'index.html');
    return readFileSync(indexPath, 'utf8');
  }
}
