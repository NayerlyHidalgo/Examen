import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { LogsModule } from './logs/logs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminAuthMiddleware } from './auth/admin-auth.middleware';
import { WebAuthMiddleware } from './auth/web-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env', '.env.production'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false,
        },
        logging: configService.get<string>('NODE_ENV') !== 'production',
        // Configuraciones adicionales para Neon
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Configuración de MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
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
    LogsModule,
    NotificationsModule,
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