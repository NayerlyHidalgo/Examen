import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart, CartItem } from './cart.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';
import { Orden } from '../orden/orden.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
  ) {}

  async getCartByUser(usuarioId: string): Promise<Cart | undefined> {
    const cart = await this.cartRepo.findOne({ where: { usuarioId: usuarioId }, relations: ['items'] });
    return cart === null ? undefined : cart;
  }

  async addToCart(usuarioId: string, productoId: string, cantidad: number, precioUnitario: number): Promise<Cart> {
    let cart = await this.getCartByUser(usuarioId);
    const usuario = await this.userRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new Error('Usuario no encontrado');
    if (!cart) {
      cart = this.cartRepo.create({
        usuario: usuario,
        usuarioId: usuario.id,
        items: [],
        total: 0,
        activo: true,
      });
    }
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    
    let items = cart.items || [];
    let item = items.find(i => i.productoId === productoId);
    if (item) {
      item.cantidad += cantidad;
      item.subtotal = item.cantidad * item.precioUnitario;
    } else {
      const product = await this.productRepo.findOne({ where: { id: productoId } });
      if (!product) throw new Error('Producto no encontrado');
      item = new CartItem();
      item.productoId = productoId;
      item.nombreProducto = product.nombre;
      item.cantidad = cantidad;
      item.precioUnitario = precioUnitario;
      item.subtotal = cantidad * precioUnitario;
      item.imagenProducto = (product.imagenes && product.imagenes[0]) || '';
      items.push(item);
    }
    cart.items = items;
    cart.total = items.reduce((sum, i) => sum + i.subtotal, 0);
    return this.cartRepo.save(cart);
  }

  async removeFromCart(usuarioId: string, productoId: string): Promise<Cart | undefined> {
    const cart = await this.getCartByUser(usuarioId);
    if (!cart) return undefined;
    cart.items = cart.items.filter(i => i.productoId !== productoId);
    cart.total = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    return this.cartRepo.save(cart);
  }

  async clearCart(usuarioId: string): Promise<Cart | undefined> {
    const cart = await this.getCartByUser(usuarioId);
    if (!cart) return undefined;
    cart.items = [];
    cart.total = 0;
    return this.cartRepo.save(cart);
  }

  // Si necesitas vincular el carrito a una orden, puedes agregar un campo ordenId en Cart y actualizarlo aquí.
}
