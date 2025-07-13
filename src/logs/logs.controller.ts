import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('test')
  async createTestLog(@Body() body?: any) {
    return this.logsService.createLog({
      action: 'TEST_LOG',
      userId: body?.userId || 'system',
      entityType: 'Test',
      details: `Test log created successfully at ${new Date().toISOString()}`,
      ipAddress: '127.0.0.1',
      userAgent: 'Test Agent',
    });
  }

  @Get()
  async getLogs(
    @Query('userId') userId?: string, 
    @Query('limit') limit?: string
  ) {
    return this.logsService.getLogs(userId, limit ? parseInt(limit) : 50);
  }

  @Get('action/:action')
  async getLogsByAction(
    @Param('action') action: string,
    @Query('limit') limit?: string
  ) {
    return this.logsService.getLogsByAction(action, limit ? parseInt(limit) : 50);
  }

  @Get('entity/:entityType/:entityId')
  async getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ) {
    return this.logsService.getLogsByEntity(entityType, entityId);
  }

  @Post('cleanup')
  async cleanupOldLogs(@Body('daysOld') daysOld: number = 30) {
    return this.logsService.deleteOldLogs(daysOld);
  }
}
