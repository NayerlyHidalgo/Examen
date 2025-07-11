import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class MainController {
  @Get()
  redirectToShop(@Req() req, @Res() res: Response) {
    const session = req.session as any;
    
    console.log('=== MAIN CONTROLLER DEBUG ===');
    console.log('Session:', session);
    console.log('Session user:', session?.user);
    console.log('===============================');
    
    // Si hay sesión activa, redirigir según el rol
    if (session && session.user) {
      // Si es admin, redirigir al dashboard admin
      if (session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com') {
        return res.redirect('/admin/dashboard');
      }
      // Si es usuario autenticado, redirigir a la tienda privada
      return res.redirect('/shop');
    }

    // Si no hay sesión, redirigir a la tienda pública
    return res.redirect('/tienda');
  }
  
  @Get('debug')
  debug(@Req() req, @Res() res: Response) {
    const session = req.session as any;
    return res.json({
      session: session,
      user: session?.user,
      adminAuthenticated: session?.adminAuthenticated,
      path: req.path,
      originalUrl: req.originalUrl
    });
  }
}
