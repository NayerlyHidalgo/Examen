import { Controller, Get, Post, Render, Body, Session, Res } from '@nestjs/common';
import { Response } from 'express';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentMethod {
  type: 'credit' | 'debit';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

@Controller('cart')
export class CartWebController {
  
  @Get()
  @Render('cart/index')
  async viewCart(@Session() session: any) {
    const cartItems: CartItem[] = session.cart || [];
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      title: 'Carrito de Compras - Tattoo Shop',
      cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  @Post('add')
  async addToCart(
    @Body() body: { productId: string; name: string; price: number; quantity?: number; image?: string },
    @Session() session: any,
    @Res() res: Response
  ) {
    if (!session.cart) {
      session.cart = [];
    }

    const { productId, name, price, quantity = 1, image } = body;
    const existingItem = session.cart.find((item: CartItem) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      session.cart.push({
        id: productId,
        name,
        price,
        quantity,
        image
      });
    }

    return res.json({ 
      success: true, 
      message: 'Producto agregado al carrito',
      cartCount: session.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    });
  }

  @Post('update')
  async updateCart(
    @Body() body: { productId: string; quantity: number },
    @Session() session: any,
    @Res() res: Response
  ) {
    if (!session.cart) {
      return res.json({ success: false, message: 'Carrito vacío' });
    }

    const { productId, quantity } = body;
    const item = session.cart.find((item: CartItem) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        session.cart = session.cart.filter((item: CartItem) => item.id !== productId);
      } else {
        item.quantity = quantity;
      }
    }

    const total = session.cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

    return res.json({ 
      success: true, 
      total,
      cartCount: session.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    });
  }

  @Post('remove')
  async removeFromCart(
    @Body() body: { productId: string },
    @Session() session: any,
    @Res() res: Response
  ) {
    if (!session.cart) {
      return res.json({ success: false, message: 'Carrito vacío' });
    }

    const { productId } = body;
    session.cart = session.cart.filter((item: CartItem) => item.id !== productId);

    const total = session.cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

    return res.json({ 
      success: true, 
      total,
      cartCount: session.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    });
  }

  @Get('checkout')
  @Render('cart/checkout')
  async checkout(@Session() session: any) {
    const cartItems: CartItem[] = session.cart || [];
    
    if (cartItems.length === 0) {
      return { redirect: '/cart' };
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50; // Costo de envío fijo
    const tax = subtotal * 0.16; // 16% de impuesto
    const total = subtotal + shipping + tax;
    
    return {
      title: 'Finalizar Compra - Tattoo Shop',
      cartItems,
      subtotal,
      shipping,
      tax,
      total
    };
  }

  @Post('process-payment')
  async processPayment(
    @Body() body: { payment: PaymentMethod; billing: BillingInfo },
    @Session() session: any,
    @Res() res: Response
  ) {
    const cartItems: CartItem[] = session.cart || [];
    
    if (cartItems.length === 0) {
      return res.json({ success: false, message: 'Carrito vacío' });
    }

    const { payment, billing } = body;

    // Validar información de pago
    const validationResult = this.validatePayment(payment);
    if (!validationResult.valid) {
      return res.json({ success: false, message: validationResult.message });
    }

    // Simular procesamiento de pago
    const paymentResult = await this.simulatePaymentProcessing(payment, cartItems);
    
    if (paymentResult.success) {
      // Guardar información del pedido
      const order = {
        id: this.generateOrderId(),
        items: cartItems,
        billing,
        payment: {
          type: payment.type,
          cardNumber: payment.cardNumber.substr(-4),
          amount: paymentResult.amount
        },
        status: 'completed',
        createdAt: new Date()
      };

      // Guardar pedido en sesión (en producción, guardarlo en base de datos)
      if (!session.orders) {
        session.orders = [];
      }
      session.orders.push(order);

      // Limpiar carrito
      session.cart = [];

      return res.json({ 
        success: true, 
        orderId: order.id,
        message: 'Pago procesado exitosamente' 
      });
    } else {
      return res.json({ 
        success: false, 
        message: paymentResult.message 
      });
    }
  }

  @Get('success')
  @Render('cart/success')
  async paymentSuccess(@Session() session: any) {
    const orders = session.orders || [];
    const lastOrder = orders[orders.length - 1];

    if (!lastOrder) {
      return { redirect: '/cart' };
    }

    return {
      title: 'Pago Exitoso - Tattoo Shop',
      order: lastOrder
    };
  }

  @Get('sync')
  async syncCart(@Session() session: any, @Res() res: Response) {
    const cartItems: CartItem[] = session.cart || [];
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return res.json({
      success: true,
      cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  }

  @Post('clear')
  async clearCart(@Session() session: any, @Res() res: Response) {
    session.cart = [];
    
    return res.json({ 
      success: true, 
      message: 'Carrito limpiado',
      cartCount: 0
    });
  }

  private validatePayment(payment: PaymentMethod): { valid: boolean; message?: string } {
    // Validar número de tarjeta
    if (!this.validateCardNumber(payment.cardNumber)) {
      return { valid: false, message: 'Número de tarjeta inválido' };
    }

    // Validar fecha de expiración
    if (!this.validateExpiryDate(payment.expiryDate)) {
      return { valid: false, message: 'Fecha de expiración inválida' };
    }

    // Validar CVV
    if (!this.validateCVV(payment.cvv)) {
      return { valid: false, message: 'CVV inválido' };
    }

    // Validar nombre del titular
    if (!payment.cardholderName || payment.cardholderName.trim().length < 2) {
      return { valid: false, message: 'Nombre del titular requerido' };
    }

    return { valid: true };
  }

  private validateCardNumber(cardNumber: string): boolean {
    // Implementar algoritmo de Luhn para validar número de tarjeta
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    let sum = 0;
    let alternate = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cleanNumber.charAt(i), 10);
      
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  }

  private validateExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiry = new Date(year, month - 1);

    return expiry > now;
  }

  private validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  private async simulatePaymentProcessing(payment: PaymentMethod, cartItems: CartItem[]): Promise<{ success: boolean; amount: number; message?: string }> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simular diferentes escenarios de pago
    const cardNumber = payment.cardNumber.replace(/\s+/g, '');
    
    // Simular fallo de pago para ciertos números de tarjeta
    if (cardNumber.endsWith('0000')) {
      return { success: false, amount: 0, message: 'Fondos insuficientes' };
    }
    
    if (cardNumber.endsWith('1111')) {
      return { success: false, amount: 0, message: 'Tarjeta declinada' };
    }

    // Simular éxito para otros números
    return { success: true, amount };
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
