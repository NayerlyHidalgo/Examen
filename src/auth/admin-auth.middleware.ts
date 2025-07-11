import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AdminAuthMiddleware - Path:', req.path);
    console.log('AdminAuthMiddleware - Session:', req.session);
    
    // Rutas públicas que no requieren autenticación
    const publicPaths = [
      '/auth/login',
      '/auth/register',
      '/auth/logout',
      '/auth/web-login',
      '/auth/web-register',
      '/tienda',
      '/api/',
      '/css/',
      '/js/',
      '/images/',
      '/favicon.ico',
      '/debug'
    ];

    // Verificar si la ruta es pública
    const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
    
    if (isPublicPath) {
      console.log('Public path, allowing access');
      return next();
    }

    // Verificar si el usuario está autenticado
    const session = req.session as any;
    const isAuthenticated = session?.user || session?.adminAuthenticated;
    
    console.log('Is authenticated:', isAuthenticated);
    console.log('Session user:', session?.user);
    
    if (!isAuthenticated) {
      // Si es una solicitud AJAX, devolver error JSON
      if (req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ 
          error: 'Acceso no autorizado. Se requiere autenticación.' 
        });
      }
      
      // Si es una solicitud HTML, redirigir al login
      console.log('Not authenticated, redirecting to login');
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }

    // Usuario autenticado, continuar
    console.log('User authenticated, continuing');
    next();
  }
}
