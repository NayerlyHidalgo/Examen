import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Orden, OrdenItem, EstadoOrden, MetodoPago } from './orden.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

export interface OrdenProductoDto {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CrearOrdenDto {
  usuarioId: string;
  productos: OrdenProductoDto[];
}

@Injectable()
export class OrdenService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async crearOrden(dto: CrearOrdenDto): Promise<Orden | null> {
    const usuario = await this.userRepo.findOne({ where: { id: dto.usuarioId } });
    if (!usuario) return null;

    // Calcular totales
    let subtotal = 0;
    const items: OrdenItem[] = dto.productos.map(prod => {
      const itemSubtotal = prod.cantidad * prod.precioUnitario;
      subtotal += itemSubtotal;
      const item = new OrdenItem();
      item.productoId = prod.productoId;
      item.nombreProducto = '';
      item.cantidad = prod.cantidad;
      item.precioUnitario = prod.precioUnitario;
      item.subtotal = itemSubtotal;
      return item;
    });

    // Puedes ajustar impuestos, costoEnvio, descuento según lógica de negocio
    const impuestos = Math.round(subtotal * 0.19 * 100) / 100; // 19% IVA con redondeo preciso
    const costoEnvio = subtotal > 100 ? 0 : 15; // Envío gratis si es mayor a $100
    const descuento = 0;
    const total = Math.round((subtotal + impuestos + costoEnvio - descuento) * 100) / 100; // Total con redondeo preciso

    const orden = this.ordenRepo.create({
      usuario,
      usuarioId: usuario.id,
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      impuestos: parseFloat(impuestos.toFixed(2)),
      costoEnvio: parseFloat(costoEnvio.toFixed(2)),
      descuento: parseFloat(descuento.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      estado: undefined,
      metodoPago: undefined,
      direccionEnvio: '',
      ciudadEnvio: '',
      codigoPostalEnvio: '',
      paisEnvio: '',
      notas: '',
    });

    return this.ordenRepo.save(orden);
  }

  async obtenerOrdenesPorUsuario(usuarioId: string): Promise<Orden[]> {
    return this.ordenRepo.find({ where: { usuario: { id: usuarioId } } });
  }

  async obtenerOrdenPorId(id: string): Promise<Orden | undefined> {
    const orden = await this.ordenRepo.findOne({ where: { id } });
    return orden === null ? undefined : orden;
  }

  async getAllOrdenes(): Promise<Orden[]> {
    return this.ordenRepo.find();
  }

  async createGuestOrder(data: {
    customerInfo: any;
    items: any[];
    total: number;
    paymentMethod: string;
    cardInfo: any;
  }): Promise<Orden> {
    // Generar número de orden único
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Calcular subtotal y envío
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const iva = Math.round(subtotal * 0.19 * 100) / 100; // 19% IVA con redondeo preciso
    const shipping = subtotal > 100 ? 0 : 15; // Envío gratis si es mayor a $100
    const total = Math.round((subtotal + iva + shipping) * 100) / 100; // Total con redondeo preciso

    // Crear items de la orden
    const items: OrdenItem[] = data.items.map(item => {
      const orderItem = new OrdenItem();
      orderItem.productoId = item.product.id;
      orderItem.nombreProducto = item.product.name || item.product.nombre;
      orderItem.cantidad = item.quantity;
      orderItem.precioUnitario = parseFloat(item.price.toFixed(2));
      orderItem.subtotal = parseFloat(item.total.toFixed(2));
      return orderItem;
    });

    // Crear orden
    const orden = this.ordenRepo.create({
      orderNumber,
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      impuestos: parseFloat(iva.toFixed(2)),
      costoEnvio: parseFloat(shipping.toFixed(2)),
      descuento: 0,
      total: parseFloat(total.toFixed(2)),
      estado: EstadoOrden.PENDIENTE,
      metodoPago: data.paymentMethod === 'credit-card' ? MetodoPago.TARJETA_CREDITO : MetodoPago.TARJETA_DEBITO,
      direccionEnvio: '',
      ciudadEnvio: '',
      codigoPostalEnvio: '',
      paisEnvio: '',
      notas: '',
      // Información del cliente invitado
      guestCustomerInfo: {
        firstName: data.customerInfo.firstName,
        lastName: data.customerInfo.lastName,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone
      },
      // Información del pago
      paymentInfo: {
        method: data.paymentMethod,
        cardType: data.cardInfo.cardType,
        lastFour: data.cardInfo.lastFour,
        status: 'completed'
      }
    });

    return this.ordenRepo.save(orden);
  }

  async findByOrderNumber(orderNumber: string): Promise<Orden | undefined> {
    const orden = await this.ordenRepo.findOne({ 
      where: { orderNumber },
      relations: ['items']
    });
    return orden === null ? undefined : orden;
  }
}
