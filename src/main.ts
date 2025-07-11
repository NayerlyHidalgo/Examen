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

  // Comentar ValidationPipe global temporalmente para evitar conflictos con auth
  // app.useGlobalPipes(new ValidationPipe({ 
  //   whitelist: true, 
  //   forbidNonWhitelisted: true,
  //   transform: true,
  //   // Excluir rutas específicas de validación
  //   skipMissingProperties: false,
  //   // Permitir que algunos endpoints manejen validación manualmente
  //   disableErrorMessages: false
  // }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Configurar sesiones
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'tattoo-shop-secret-key-2025',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Configurar archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Configurar motor de plantillas Handlebars
  setupHandlebars(app);
  
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
  console.log(`🏠 Página de inicio: http://localhost:${port}/`);
  console.log(`🛒 Tienda: http://localhost:${port}/shop`);
  console.log(`📊 Dashboard de facturación: http://localhost:${port}/web/invoices`);
  console.log(`🔑 Login unificado: http://localhost:${port}/auth/login`);
  console.log(`🔗 API Documentation: http://localhost:${port}/api`);
}
bootstrap();
