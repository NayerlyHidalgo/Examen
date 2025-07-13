import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para permitir conexiones desde cualquier cliente
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Filtro global de excepciones
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Prefijo global para todas las rutas API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API REST pura corriendo en: http://localhost:${port}/api`);
  console.log(`📖 Documentación disponible en: http://localhost:${port}/api`);
  console.log(`� Health check: http://localhost:${port}/api/health`);
  console.log(`🧪 Test logs: POST http://localhost:${port}/api/logs/test`);
}
bootstrap();
