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

  // Configurar CORS para la aplicación web
  app.enableCors({
    origin: [
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
  console.log(`🌐 URL de Railway: https://examen-production.up.railway.app/productos`);
  console.log(`🏠 Página principal: /productos/`);
  console.log(`🛒 Tienda pública: /productos/tienda`);
  console.log(`🛒 Carrito: /productos/cart`);
  console.log(`🔑 Login: /productos/auth/login`);
  console.log(`📊 Admin: /productos/admin`);
  console.log(`🔗 API: /productos/api/health`);
  console.log(`📧 Contact: /productos/contact`);
  console.log(`ℹ️ About: /productos/about`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📖 Documentación: Las rutas están disponibles en la URL de Railway`);
  console.log(`🎯 Deploy listo para Railway`);
}

bootstrap();