import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedTattooProducts } from './seed-tattoo-products';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  getApiInfo() {
    return {
      message: 'Tattoo Shop API REST',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        products: '/api/products',
        categories: '/api/categories',
        cart: '/api/cart',
        orders: '/api/orden',
        invoices: '/api/invoices',
        reviews: '/api/review',
        notifications: '/api/notifications',
        logs: '/api/logs',
        mail: '/api/mail'
      },
      documentation: '/api/docs'
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      message: this.appService.getHello(),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
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
