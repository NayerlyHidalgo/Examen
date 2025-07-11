import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RegistrationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Si es una petición POST a /auth/register, modificar el body para evitar problemas
    if (req.method === 'POST' && req.path === '/auth/register') {
      // Asegurar que todos los campos están presentes como strings
      req.body = {
        username: req.body.username || '',
        email: req.body.email || '',
        password: req.body.password || '',
        confirmPassword: req.body.confirmPassword || '',
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        telefono: req.body.telefono || ''
      };
    }
    next();
  }
}
