import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('公用接口')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(): string {
    return this.appService.findAll();
  }
}
