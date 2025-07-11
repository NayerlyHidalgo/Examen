import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainController } from './main.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MailModule } from './mail/mail.module';
import { OrdenModule } from './orden/orden.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { ReviewModule } from './review/review.module';
import { InvoicesModule } from './invoices/invoices.module';
import { HomeModule } from './home/home.module';
import { ShopModule } from './shop/shop.module';
import { PublicShopModule } from './public-shop/public-shop.module';
import { AdminModule } from './admin/admin.module';
import { AdminAuthMiddleware } from './auth/admin-auth.middleware';
import { WebAuthMiddleware } from './auth/web-auth.middleware';

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
      ssl:{ rejectUnauthorized: false },
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    MailModule,
    OrdenModule,
    CartModule,
    ReviewModule,
    ProductsModule,
    InvoicesModule,
    HomeModule,
    ShopModule,
    PublicShopModule,
    AdminModule,
  ],
  controllers: [AppController, MainController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de autenticación a todas las rutas protegidas
    consumer
      .apply(AdminAuthMiddleware)
      .exclude(
        'auth/login', 
        'auth/register', 
        'auth/logout',
        'tienda',
        'tienda/(.*)',
        'api/(.*)',
        'css/(.*)',
        'js/(.*)',
        'images/(.*)',
        'favicon.ico',
        'debug'
      )
      .forRoutes('*');
  }
}
