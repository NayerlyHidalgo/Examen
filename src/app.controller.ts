import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedTattooProducts } from './seed-tattoo-products';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get('health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed')
  async seedData() {
    try {
      await seedTattooProducts(this.dataSource);
      return { message: 'Datos de prueba creados exitosamente' };
    } catch (error) {
      console.error('Error al sembrar datos:', error);
      return { error: 'Error al sembrar datos', details: error.message };
    }
  }
}
