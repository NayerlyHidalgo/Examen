import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  OTHER = 'other'
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNumber: string; // Número de factura correlativo

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'date' })
  issueDate: Date; // Fecha de emisión

  @Column({ type: 'date', nullable: true })
  dueDate: Date; // Fecha de vencimiento

  @Column({ type: 'date', nullable: true })
  paidDate: Date; // Fecha de pago

  // Información del cliente
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ nullable: true })
  customerName: string; // Nombre del cliente en la factura

  @Column({ nullable: true })
  customerEmail: string; // Email del cliente en la factura

  @Column({ nullable: true })
  customerPhone: string; // Teléfono del cliente

  @Column({ nullable: true })
  customerAddress: string; // Dirección del cliente

  @Column({ nullable: true })
  customerDocument: string; // Cédula/RUC del cliente

  @Column({ nullable: true })
  customerDocumentType: string; // Tipo de documento (cedula, ruc, pasaporte)

  // Totales
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: number; // Subtotal sin impuestos

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number; // Monto de impuestos

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  taxPercentage: number; // Porcentaje de impuesto aplicado

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountAmount: number; // Monto de descuento

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discountPercentage: number; // Porcentaje de descuento

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: number; // Total final

  // Información de pago
  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  paymentReference: string; // Referencia de pago

  @Column('text', { nullable: true })
  notes: string; // Notas adicionales

  @Column('text', { nullable: true })
  terms: string; // Términos y condiciones

  // Detalles de la factura
  @OneToMany('InvoiceDetail', 'invoice', { 
    cascade: true, 
    eager: true 
  })
  details: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos para calcular totales
  calculateSubtotal(): number {
    return this.details?.reduce((sum, detail) => sum + detail.getLineTotal(), 0) || 0;
  }

  calculateTaxAmount(): number {
    return (this.subtotal * this.taxPercentage) / 100;
  }

  calculateTotal(): number {
    return this.subtotal + this.taxAmount - this.discountAmount;
  }

  updateTotals(): void {
    this.subtotal = this.calculateSubtotal();
    this.taxAmount = this.calculateTaxAmount();
    this.total = this.calculateTotal();
  }
}
