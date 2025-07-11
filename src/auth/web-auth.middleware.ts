import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WebAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if user is authenticated
    const session = req.session as any;
    if (!session || !session.user) {
      // If it's an API request, return JSON error
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para acceder a este recurso'
        });
      }
      
      // For web requests, redirect to login
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    
    next();
  }
}
