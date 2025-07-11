import { Controller, Get, Render, Query, Param, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async shop(@Query() query: any, @Req() req, @Res() res: Response) {
    const session = req.session as any;
    
    // Verificar si el usuario tiene sesión
    if (!session || (!session.user && !session.adminAuthenticated)) {
      console.log('No session found, redirecting to login');
      return res.redirect('/auth/login');
    }
    
    // Si es admin, redirigir al dashboard admin
    if (session.adminAuthenticated || 
        (session.user && (session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com'))) {
      console.log('Admin detected, redirecting to admin dashboard');
      return res.redirect('/admin/dashboard');
    }
    
    // Para usuarios regulares, mostrar la interfaz de cliente
    console.log('Regular user detected, showing shop interface');
    
    const { category, search, page = 1, limit = 12 } = query;
    
    try {
      const user = session?.user ? {
        ...session.user,
        isAdmin: false
      } : null;

      // Obtener productos con filtros
      const products = await this.productsService.findAll({
        category,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      // Obtener categorías para el filtro
      const categoriesResult = await this.categoriesService.findAll();
      const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

      // Productos destacados
      const featuredProducts = await this.productsService.findAll({
        limit: 4,
        featured: true,
      });

      return res.render('shop/client', {
        title: 'Tienda - Tattoo Shop',
        description: 'Encuentra los mejores implementos para tatuaje',
        user,
        products: products.data || [],
        categories: categories,
        featuredProducts: featuredProducts.data || [],
        pagination: {
          current: parseInt(page),
          total: Math.ceil((products.total || 0) / parseInt(limit)),
          hasNext: parseInt(page) < Math.ceil((products.total || 0) / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
        filters: {
          category: category || '',
          search: search || '',
        },
        totalProducts: products.total || 0,
      });
    } catch (error) {
      console.error('Error al cargar la tienda:', error);
      return res.render('shop/client', {
        title: 'Tienda - Tattoo Shop',
        description: 'Encuentra los mejores implementos para tatuaje',
        user: session?.user || null,
        products: [],
        categories: [],
        featuredProducts: [],
        pagination: { current: 1, total: 1, hasNext: false, hasPrev: false },
        filters: { category: '', search: '' },
        totalProducts: 0,
        error: 'Error al cargar los productos',
      });
    }
  }

  @Get('product/:id')
  @Render('shop/product')
  async productDetail(@Param('id') id: string, @Req() req) {
    try {
      // Obtener información del usuario de la sesión
      const session = req.session as any;
      const user = session?.user ? {
        ...session.user,
        isAdmin: session.user.role === 'admin' || session.user.email === 'melifer.j1995@gmail.com'
      } : null;

      const product = await this.productsService.findOne(id);
      
      if (!product) {
        return {
          title: 'Producto no encontrado - Tattoo Shop',
          user,
          error: 'Producto no encontrado',
        };
      }

      // Productos relacionados
      const relatedProducts = await this.productsService.findAll({
        category: product.categoria?.id,
        limit: 4,
        exclude: product.id,
      });

      return {
        title: `${product.nombre} - Tattoo Shop`,
        description: product.descripcion || 'Producto de alta calidad para tatuaje',
        user,
        product,
        relatedProducts: relatedProducts.data || [],
      };
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      return {
        title: 'Error - Tattoo Shop',
        error: 'Error al cargar el producto',
      };
    }
  }

  @Get('category/:categoryId')
  @Render('shop/category')
  async categoryProducts(@Param('categoryId') categoryId: string, @Query() query: any) {
    const { page = 1, limit = 12 } = query;
    
    try {
      const category = await this.categoriesService.findOne(categoryId);
      
      if (!category) {
        return {
          title: 'Categoría no encontrada - Tattoo Shop',
          error: 'Categoría no encontrada',
        };
      }

      const products = await this.productsService.findAll({
        category: categoryId,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      return {
        title: `${category.name} - Tattoo Shop`,
        description: `Productos de ${category.name} para tatuaje`,
        category,
        products: products.data || [],
        pagination: {
          current: parseInt(page),
          total: Math.ceil((products.total || 0) / parseInt(limit)),
          hasNext: parseInt(page) < Math.ceil((products.total || 0) / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
        totalProducts: products.total || 0,
      };
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      return {
        title: 'Error - Tattoo Shop',
        error: 'Error al cargar la categoría',
      };
    }
  }
  
  @Get('test')
  async testShop(@Req() req, @Res() res: Response) {
    const session = req.session as any;
    
    return res.json({
      message: 'Shop controller is working!',
      session: session,
      user: session?.user,
      adminAuthenticated: session?.adminAuthenticated,
      timestamp: new Date().toISOString()
    });
  }
}
