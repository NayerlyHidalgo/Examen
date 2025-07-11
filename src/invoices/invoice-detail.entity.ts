import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from '../products/products.entity';

@Entity('invoice_details')
export class InvoiceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, invoice => invoice.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Información del producto al momento de la factura
  @Column()
  productName: string; // Nombre del producto en la factura

  @Column({ nullable: true })
  productDescription: string; // Descripción del producto

  @Column({ nullable: true })
  productSku: string; // SKU del producto

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number; // Precio unitario al momento de la factura

  @Column('int')
  quantity: number; // Cantidad

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discountPercentage: number; // Descuento por línea

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number; // Monto de descuento por línea

  @Column('decimal', { precision: 10, scale: 2 })
  lineTotal: number; // Total de la línea

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  taxPercentage: number; // Porcentaje de impuesto por línea

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxAmount: number; // Monto de impuesto por línea

  @Column('text', { nullable: true })
  notes: string; // Notas específicas del item

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos para calcular totales
  getSubtotal(): number {
    return this.unitPrice * this.quantity;
  }

  getDiscountAmount(): number {
    if (this.discountAmount > 0) {
      return this.discountAmount;
    }
    return (this.getSubtotal() * this.discountPercentage) / 100;
  }

  getTaxAmount(): number {
    const subtotalAfterDiscount = this.getSubtotal() - this.getDiscountAmount();
    return (subtotalAfterDiscount * this.taxPercentage) / 100;
  }

  getLineTotal(): number {
    return this.getSubtotal() - this.getDiscountAmount() + this.getTaxAmount();
  }

  updateTotals(): void {
    this.discountAmount = this.getDiscountAmount();
    this.taxAmount = this.getTaxAmount();
    this.lineTotal = this.getLineTotal();
  }
}
