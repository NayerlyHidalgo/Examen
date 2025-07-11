import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':usuarioId')
  async getCart(@Param('usuarioId') usuarioId: string) {
    return this.cartService.getCartByUser(usuarioId);
  }

  @Post('add')
  async addToCart(
    @Body() body: { usuarioId: string; productoId: string; cantidad: number; precioUnitario: number }
  ) {
    return this.cartService.addToCart(body.usuarioId, body.productoId, body.cantidad, body.precioUnitario);
  }

  @Post('remove')
  async removeFromCart(
    @Body() body: { usuarioId: string; productoId: string }
  ) {
    return this.cartService.removeFromCart(body.usuarioId, body.productoId);
  }

  @Delete('clear/:usuarioId')
  async clearCart(@Param('usuarioId') usuarioId: string) {
    return this.cartService.clearCart(usuarioId);
  }

  // El método linkCartToOrder fue eliminado porque la relación directa ya no existe en la nueva estructura.
}
