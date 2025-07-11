import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupHandlebars } from './config/handlebars.config';
const session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar CORS para el dominio personalizado
  app.enableCors({
    origin: [
      'http://tatto-shop.desarrollo-software.xyz',
      'https://tatto-shop.desarrollo-software.xyz',
      'http://localhost:3001',
      'http://localhost:3000'
    ],
    credentials: true,
  });

  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix('productos');

  // Filtro global de excepciones
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Configurar sesiones
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'tattoo-shop-secret-key-2025',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Configurar archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Configurar motor de plantillas Handlebars
  setupHandlebars(app);
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Servidor iniciado en puerto ${port}`);
  console.log(`🌐 Dominio personalizado: http://tatto-shop.desarrollo-software.xyz/productos`);
  console.log(`🏠 Página principal: http://tatto-shop.desarrollo-software.xyz/productos/`);
  console.log(`🛒 Tienda pública: http://tatto-shop.desarrollo-software.xyz/productos/tienda`);
  console.log(`🛒 Carrito: http://tatto-shop.desarrollo-software.xyz/productos/cart`);
  console.log(`🔑 Login: http://tatto-shop.desarrollo-software.xyz/productos/auth/login`);
  console.log(`📊 Admin: http://tatto-shop.desarrollo-software.xyz/productos/admin`);
  console.log(`🔗 API: http://tatto-shop.desarrollo-software.xyz/productos/api/health`);
  console.log(`📧 Contact: http://tatto-shop.desarrollo-software.xyz/productos/contact`);
  console.log(`ℹ️ About: http://tatto-shop.desarrollo-software.xyz/productos/about`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();