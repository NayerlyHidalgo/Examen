import { Controller, Get, Post, Render, Body, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

interface SessionData {
  adminAuthenticated?: boolean;
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
}

interface RequestWithSession extends Request {
  session: SessionData & any;
}

@Controller('admin')
export class AdminController {
  private readonly ADMIN_EMAIL = 'melifer.j1995@gmail.com';
  private readonly ADMIN_PASSWORD = 'M3l5N128.12';

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('login')
  @Render('admin/login')
  loginPage(@Req() req: RequestWithSession) {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session?.adminAuthenticated) {
      return { redirect: '/admin/dashboard' };
    }
    
    return {
      title: 'Acceso Administrativo - Tattoo Shop',
      error: null
    };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Session() session: any,
    @Res() res: Response
  ) {
    const { email, password } = body;

    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      session.adminAuthenticated = true;
      session.adminUser = {
        email: this.ADMIN_EMAIL,
        name: 'Administrador',
        role: 'admin'
      };
      
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('admin/login', {
        title: 'Acceso Administrativo - Tattoo Shop',
        error: 'Credenciales incorrectas. Verifique su email y contraseña.'
      });
    }
  }

  @Post('logout')
  logout(@Session() session: any, @Res() res: Response) {
    session.destroy((err: any) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }
      res.redirect('/');
    });
  }

  @Get('dashboard')
  @Render('admin/dashboard')
  async dashboard(@Session() session: any) {
    if (!session.adminAuthenticated) {
      return { redirect: '/admin/login' };
    }

    const productsResult = await this.productsService.findAll({
      page: 1,
      limit: 100
    });
    
    const categoriesResult = await this.categoriesService.findAll();
    const totalCategories = Array.isArray(categoriesResult) ? categoriesResult.length : 0;
    
    const recentProducts = await this.productsService.findAll({
      page: 1,
      limit: 5
    });

    return {
      title: 'Panel Administrativo - Tattoo Shop',
      user: session.adminUser,
      stats: {
        totalProducts: productsResult.total,
        totalCategories: totalCategories,
        totalOrders: 0,
        totalRevenue: 0
      },
      recentProducts: recentProducts.data
    };
  }
}
