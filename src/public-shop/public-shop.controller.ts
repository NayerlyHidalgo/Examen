import { Controller, Get, Post, Query, Param, Body, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { OrdenService } from '../orden/orden.service';

@Controller('tienda')
export class PublicShopController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly orderService: OrdenService,
  ) {}

  @Get()
  async publicShop(@Query() query: any, @Req() req, @Res() res: Response) {
    const { category, search, page = 1, limit = 12 } = query;
    
    try {
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

      return res.render('public-shop/catalog', {
        title: 'Tienda - Tattoo Shop',
        description: 'Encuentra los mejores implementos para tatuaje',
        isPublic: true,
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
      console.error('Error al cargar la tienda pública:', error);
      return res.render('public-shop/catalog', {
        title: 'Tienda - Tattoo Shop',
        description: 'Encuentra los mejores implementos para tatuaje',
        isPublic: true,
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

  @Get('producto/:id')
  async publicProductDetail(@Param('id') id: string, @Req() req, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(id);
      
      if (!product) {
        return res.render('public-shop/product-detail', {
          title: 'Producto no encontrado - Tattoo Shop',
          isPublic: true,
          error: 'Producto no encontrado',
        });
      }

      // Productos relacionados
      const relatedProducts = await this.productsService.findAll({
        category: product.categoria?.id,
        limit: 4,
        exclude: product.id,
      });

      return res.render('public-shop/product-detail', {
        title: `${product.nombre} - Tattoo Shop`,
        description: product.descripcion || 'Producto de alta calidad para tatuaje',
        isPublic: true,
        product,
        relatedProducts: relatedProducts.data || [],
      });
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      return res.render('public-shop/product-detail', {
        title: 'Error - Tattoo Shop',
        isPublic: true,
        error: 'Error al cargar el producto',
      });
    }
  }

  @Get('carrito')
  async publicCart(@Req() req, @Res() res: Response) {
    return res.render('public-shop/cart', {
      title: 'Carrito de Compras - Tattoo Shop',
      isPublic: true,
    });
  }

  @Post('checkout')
  async publicCheckout(@Body() body: any, @Req() req, @Res() res: Response) {
    try {
      const {
        items,
        customerInfo,
        paymentMethod,
        cardInfo
      } = body;

      // Validar información del cliente
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
        return res.status(400).json({
          error: 'Información del cliente requerida'
        });
      }

      // Validar información de la tarjeta
      if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv) {
        return res.status(400).json({
          error: 'Información de la tarjeta requerida'
        });
      }

      // Calcular total
      let total = 0;
      const orderItems: Array<{
        product: any;
        quantity: number;
        price: number;
        total: number;
      }> = [];

      for (const item of items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          return res.status(400).json({
            error: `Producto ${item.productId} no encontrado`
          });
        }

        const itemTotal = parseFloat((product.precio * item.quantity).toFixed(2));
        total += itemTotal;

        orderItems.push({
          product: product,
          quantity: item.quantity,
          price: parseFloat(product.precio.toFixed(2)),
          total: itemTotal
        });
      }

      // Formatear el total final
      total = parseFloat(total.toFixed(2));

      // Crear orden como invitado
      const order = await this.orderService.createGuestOrder({
        customerInfo,
        items: orderItems,
        total,
        paymentMethod,
        cardInfo: {
          lastFour: cardInfo.cardNumber.slice(-4),
          cardType: this.detectCardType(cardInfo.cardNumber)
        }
      });

      // Simular procesamiento de pago
      // En producción, aquí integrarías con Stripe, PayPal, etc.
      const paymentResult = await this.processPayment(cardInfo, total);

      if (paymentResult.success) {
        return res.json({
          success: true,
          orderId: order.id,
          message: 'Compra realizada exitosamente',
          orderNumber: order.orderNumber
        });
      } else {
        return res.status(400).json({
          error: 'Error al procesar el pago',
          details: paymentResult.error
        });
      }

    } catch (error) {
      console.error('Error en checkout público:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  @Get('orden/:orderNumber')
  async publicOrderConfirmation(@Param('orderNumber') orderNumber: string, @Req() req, @Res() res: Response) {
    try {
      const order = await this.orderService.findByOrderNumber(orderNumber);
      
      if (!order) {
        return res.render('public-shop/order-not-found', {
          title: 'Orden no encontrada - Tattoo Shop',
          isPublic: true,
        });
      }

      return res.render('public-shop/order-confirmation', {
        title: 'Confirmación de Compra - Tattoo Shop',
        isPublic: true,
        order,
      });
    } catch (error) {
      console.error('Error al cargar la orden:', error);
      return res.render('public-shop/order-not-found', {
        title: 'Error - Tattoo Shop',
        isPublic: true,
        error: 'Error al cargar la orden',
      });
    }
  }

  private detectCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s+/g, '');
    
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'MasterCard';
    if (number.startsWith('3')) return 'American Express';
    
    return 'Unknown';
  }

  private async processPayment(cardInfo: any, amount: number): Promise<{success: boolean, error?: string}> {
    // Simulación de procesamiento de pago
    // En producción, aquí integrarías con tu procesador de pagos
    
    // Validaciones básicas
    if (cardInfo.cardNumber.length < 15) {
      return { success: false, error: 'Número de tarjeta inválido' };
    }
    
    if (cardInfo.cvv.length < 3) {
      return { success: false, error: 'CVV inválido' };
    }
    
    // Simular demora de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito del pago
    return { success: true };
  }
}
