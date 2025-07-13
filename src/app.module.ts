import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MailModule } from './mail/mail.module';
import { OrdenModule } from './orden/orden.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { ReviewModule } from './review/review.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LogsModule } from './logs/logs.module';
import { AdminAuthMiddleware } from './auth/admin-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Adjust based on your SSL configuration
      }
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/tattoo-shop'),
    AuthModule,
    UsersModule,
    CategoriesModule,
    MailModule,
    OrdenModule,
    CartModule,
    ReviewModule,
    ProductsModule,
    InvoicesModule,
    AdminModule,
    NotificationsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware de autenticación temporalmente deshabilitado
    // Solo se aplicará a rutas API cuando sea necesario
    // consumer
    //   .apply(AdminAuthMiddleware)
    //   .exclude(
    //     'api/auth/login', 
    //     'api/auth/register', 
    //     'api/auth/logout',
    //     'api/health',
    //     'api/logs/test'
    //   )
    //   .forRoutes('api/*');
  }
}