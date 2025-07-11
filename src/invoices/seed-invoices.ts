import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus, PaymentMethod } from './invoice.entity';
import { InvoiceDetail } from './invoice-detail.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class InvoiceSeedService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceDetail)
    private invoiceDetailRepository: Repository<InvoiceDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async seedInvoices() {
    // Verificar si ya existen facturas
    const existingInvoices = await this.invoiceRepository.count();
    if (existingInvoices > 0) {
      console.log('Las facturas ya han sido creadas');
      return;
    }

    // Obtener usuarios y productos existentes
    const customers = await this.userRepository.find({ take: 5 });
    const products = await this.productRepository.find({ take: 10 });

    if (customers.length === 0 || products.length === 0) {
      console.log('No hay usuarios o productos disponibles para crear facturas');
      return;
    }

    const sampleInvoices = [
      {
        customer: customers[0],
        customerName: 'María García',
        customerEmail: 'maria.garcia@email.com',
        customerPhone: '+1234567890',
        customerAddress: 'Av. Principal 123, Ciudad',
        customerDocument: '1234567890',
        customerDocumentType: 'cedula',
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentReference: 'TXN001',
        taxPercentage: 19,
        notes: 'Factura por servicios de tatuaje completo',
        paidDate: new Date('2025-07-01'),
        details: [
          {
            product: products[0],
            quantity: 2,
            unitPrice: 50.00,
            taxPercentage: 19,
          },
          {
            product: products[1],
            quantity: 1,
            unitPrice: 75.00,
            discountPercentage: 10,
            taxPercentage: 19,
          }
        ]
      },
      {
        customer: customers[1],
        customerName: 'Carlos Rodríguez',
        customerEmail: 'carlos.rodriguez@email.com',
        customerPhone: '+1234567891',
        customerAddress: 'Calle Secundaria 456, Ciudad',
        customerDocument: '9876543210',
        customerDocumentType: 'cedula',
        status: InvoiceStatus.PENDING,
        taxPercentage: 19,
        notes: 'Pedido de suministros para estudio',
        dueDate: new Date('2025-08-15'),
        details: [
          {
            product: products[2],
            quantity: 5,
            unitPrice: 25.00,
            taxPercentage: 19,
          },
          {
            product: products[3],
            quantity: 3,
            unitPrice: 40.00,
            taxPercentage: 19,
          }
        ]
      },
      {
        customer: customers[2],
        customerName: 'Ana López',
        customerEmail: 'ana.lopez@email.com',
        customerPhone: '+1234567892',
        customerAddress: 'Plaza Central 789, Ciudad',
        customerDocument: '5555666677',
        customerDocumentType: 'cedula',
        status: InvoiceStatus.DRAFT,
        taxPercentage: 19,
        notes: 'Cotización para nuevo cliente',
        details: [
          {
            product: products[4],
            quantity: 1,
            unitPrice: 120.00,
            taxPercentage: 19,
          }
        ]
      },
      {
        customer: customers[3],
        customerName: 'Luis Martínez',
        customerEmail: 'luis.martinez@email.com',
        customerPhone: '+1234567893',
        customerAddress: 'Barrio Norte 321, Ciudad',
        customerDocument: '1111222233',
        customerDocumentType: 'cedula',
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        taxPercentage: 19,
        notes: 'Venta al contado',
        paidDate: new Date('2025-07-05'),
        details: [
          {
            product: products[5],
            quantity: 4,
            unitPrice: 30.00,
            taxPercentage: 19,
          },
          {
            product: products[6],
            quantity: 2,
            unitPrice: 60.00,
            discountPercentage: 5,
            taxPercentage: 19,
          }
        ]
      },
      {
        customer: customers[4],
        customerName: 'Sofia Hernández',
        customerEmail: 'sofia.hernandez@email.com',
        customerPhone: '+1234567894',
        customerAddress: 'Zona Sur 654, Ciudad',
        customerDocument: '9999888877',
        customerDocumentType: 'cedula',
        status: InvoiceStatus.OVERDUE,
        taxPercentage: 19,
        notes: 'Factura vencida - requiere seguimiento',
        dueDate: new Date('2025-06-30'),
        details: [
          {
            product: products[7],
            quantity: 3,
            unitPrice: 45.00,
            taxPercentage: 19,
          }
        ]
      }
    ];

    let invoiceNumber = 1;
    const year = new Date().getFullYear();

    for (const invoiceData of sampleInvoices) {
      // Crear la factura
      const invoice = this.invoiceRepository.create({
        invoiceNumber: `${year}-${invoiceNumber.toString().padStart(6, '0')}`,
        customer: invoiceData.customer,
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        customerAddress: invoiceData.customerAddress,
        customerDocument: invoiceData.customerDocument,
        customerDocumentType: invoiceData.customerDocumentType,
        status: invoiceData.status,
        issueDate: new Date(),
        dueDate: invoiceData.dueDate,
        paidDate: invoiceData.paidDate,
        paymentMethod: invoiceData.paymentMethod,
        paymentReference: invoiceData.paymentReference,
        taxPercentage: invoiceData.taxPercentage,
        notes: invoiceData.notes,
      });

      const savedInvoice = await this.invoiceRepository.save(invoice);

      // Crear los detalles
      const details: InvoiceDetail[] = [];
      for (const detailData of invoiceData.details) {
        const detail = this.invoiceDetailRepository.create({
          invoice: savedInvoice,
          product: detailData.product,
          productName: detailData.product.nombre,
          productDescription: detailData.product.descripcion,
          productSku: detailData.product.sku,
          quantity: detailData.quantity,
          unitPrice: detailData.unitPrice,
          discountPercentage: (detailData as any).discountPercentage || 0,
          taxPercentage: detailData.taxPercentage,
        });

        detail.updateTotals();
        details.push(detail);
      }

      await this.invoiceDetailRepository.save(details);

      // Actualizar totales de la factura
      savedInvoice.details = details;
      savedInvoice.updateTotals();
      await this.invoiceRepository.save(savedInvoice);

      invoiceNumber++;
    }

    console.log(`${sampleInvoices.length} facturas de ejemplo han sido creadas`);
  }
}

// Función para ejecutar el seed
export async function seedInvoicesData(
  invoiceRepository: Repository<Invoice>,
  invoiceDetailRepository: Repository<InvoiceDetail>,
  userRepository: Repository<User>,
  productRepository: Repository<Product>,
) {
  const seedService = new InvoiceSeedService(
    invoiceRepository,
    invoiceDetailRepository,
    userRepository,
    productRepository,
  );
  
  await seedService.seedInvoices();
}
