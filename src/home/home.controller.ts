import { Controller, Get, Render, Redirect, Req } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Render('home/index')
  home(@Req() req) {
    const session = req.session as any;
    const user = session?.user ? {
      ...session.user,
      isAdmin: session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com'
    } : null;

    return {
      title: 'Tattoo Shop - Tienda de Implementos',
      description: 'La mejor tienda de implementos para tatuaje profesional',
      keywords: 'tattoo, tatuaje, implementos, agujas, tintas, máquinas',
      user,
      stats: {
        totalProducts: 150,
        totalCategories: 12,
        happyCustomers: 500,
        yearsExperience: 8
      }
    };
  }

  @Get('about')
  @Render('home/about')
  about(@Req() req) {
    const session = req.session as any;
    const user = session?.user ? {
      ...session.user,
      isAdmin: session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com'
    } : null;

    return {
      title: 'Acerca de - Tattoo Shop',
      description: 'Conoce más sobre nuestro sistema de gestión',
      user
    };
  }

  @Get('contact')
  @Render('home/contact')
  contact(@Req() req) {
    const session = req.session as any;
    const user = session?.user ? {
      ...session.user,
      isAdmin: session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com'
    } : null;

    return {
      title: 'Contacto - Tattoo Shop',
      description: 'Ponte en contacto con nosotros',
      user
    };
  }
}
