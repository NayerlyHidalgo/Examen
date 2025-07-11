import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { InvoiceDetail } from './invoice-detail.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class InvoicesService {
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

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Verificar que el cliente existe
    const customer = await this.userRepository.findOne({
      where: { id: createInvoiceDto.customerId }
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que todos los productos existen y tienen stock suficiente
    for (const detailDto of createInvoiceDto.details) {
      const product = await this.productRepository.findOne({
        where: { id: detailDto.productId }
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${detailDto.productId} no encontrado`);
      }

      if (product.stock < detailDto.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${product.nombre}. Stock disponible: ${product.stock}, solicitado: ${detailDto.quantity}`
        );
      }
    }

    // Generar número de factura único
    const invoiceNumber = await this.generateInvoiceNumber();

    // Crear la factura
    const invoice = this.invoiceRepository.create({
      invoiceNumber,
      customer,
      customerName: createInvoiceDto.customerName,
      customerEmail: createInvoiceDto.customerEmail,
      customerPhone: createInvoiceDto.customerPhone,
      customerAddress: createInvoiceDto.customerAddress,
      customerDocument: createInvoiceDto.customerDocument,
      customerDocumentType: createInvoiceDto.customerDocumentType,
      issueDate: createInvoiceDto.issueDate ? new Date(createInvoiceDto.issueDate) : new Date(),
      dueDate: createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : undefined,
      taxPercentage: createInvoiceDto.taxPercentage || 0,
      discountPercentage: createInvoiceDto.discountPercentage || 0,
      discountAmount: createInvoiceDto.discountAmount || 0,
      paymentMethod: createInvoiceDto.paymentMethod,
      paymentReference: createInvoiceDto.paymentReference,
      notes: createInvoiceDto.notes,
      terms: createInvoiceDto.terms,
      status: InvoiceStatus.DRAFT,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Crear los detalles de la factura
    const invoiceDetails: InvoiceDetail[] = [];
    for (const detailDto of createInvoiceDto.details) {
      const product = await this.productRepository.findOne({
        where: { id: detailDto.productId }
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${detailDto.productId} no encontrado`);
      }

      const detail = this.invoiceDetailRepository.create({
        invoice: savedInvoice,
        product,
        productName: detailDto.productName || product.nombre,
        productDescription: detailDto.productDescription || product.descripcion,
        productSku: detailDto.productSku || product.sku,
        unitPrice: detailDto.unitPrice || product.precio,
        quantity: detailDto.quantity,
        discountPercentage: detailDto.discountPercentage || 0,
        discountAmount: detailDto.discountAmount || 0,
        taxPercentage: detailDto.taxPercentage || 0,
        notes: detailDto.notes,
      });

      detail.updateTotals();
      invoiceDetails.push(detail);
    }

    const savedDetails = await this.invoiceDetailRepository.save(invoiceDetails);
    savedInvoice.details = savedDetails;

    // Actualizar totales de la factura
    savedInvoice.updateTotals();
    await this.invoiceRepository.save(savedInvoice);

    return this.findOne(savedInvoice.id);
  }

  async findAll(filterDto: InvoiceFilterDto) {
    const { page = 1, limit = 10, search, startDate, endDate, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.details', 'details')
      .leftJoinAndSelect('details.product', 'product');

    // Aplicar filtros
    if (filters.status) {
      queryBuilder.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters.customerId) {
      queryBuilder.andWhere('invoice.customer.id = :customerId', { customerId: filters.customerId });
    }

    if (filters.invoiceNumber) {
      queryBuilder.andWhere('invoice.invoiceNumber ILIKE :invoiceNumber', { 
        invoiceNumber: `%${filters.invoiceNumber}%` 
      });
    }

    if (filters.paymentMethod) {
      queryBuilder.andWhere('invoice.paymentMethod = :paymentMethod', { 
        paymentMethod: filters.paymentMethod 
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('invoice.issueDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoiceNumber ILIKE :search OR invoice.customerName ILIKE :search OR customer.firstName ILIKE :search OR customer.lastName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenamiento
    const invoices = await queryBuilder
      .orderBy('invoice.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data: invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['customer', 'details', 'details.product'],
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Si se está marcando como pagada, establecer la fecha de pago
    if (updateInvoiceDto.status === InvoiceStatus.PAID && !invoice.paidDate) {
      updateInvoiceDto.paidDate = new Date().toISOString();
    }

    Object.assign(invoice, updateInvoiceDto);

    if (updateInvoiceDto.issueDate) {
      invoice.issueDate = new Date(updateInvoiceDto.issueDate);
    }

    if (updateInvoiceDto.dueDate) {
      invoice.dueDate = new Date(updateInvoiceDto.dueDate);
    }

    if (updateInvoiceDto.paidDate) {
      invoice.paidDate = new Date(updateInvoiceDto.paidDate);
    }

    // Si se actualizan los detalles, recalcular totales
    if (updateInvoiceDto.details) {
      // Eliminar detalles existentes
      await this.invoiceDetailRepository.delete({ invoice: { id } });

      // Crear nuevos detalles
      const newDetails: InvoiceDetail[] = [];
      for (const detailDto of updateInvoiceDto.details) {
        const product = await this.productRepository.findOne({
          where: { id: detailDto.productId }
        });

        if (!product) {
          throw new NotFoundException(`Producto con ID ${detailDto.productId} no encontrado`);
        }

        const detail = this.invoiceDetailRepository.create({
          invoice,
          product,
          productName: detailDto.productName || product.nombre,
          productDescription: detailDto.productDescription || product.descripcion,
          productSku: detailDto.productSku || product.sku,
          unitPrice: detailDto.unitPrice || product.precio,
          quantity: detailDto.quantity,
          discountPercentage: detailDto.discountPercentage || 0,
          discountAmount: detailDto.discountAmount || 0,
          taxPercentage: detailDto.taxPercentage || 0,
          notes: detailDto.notes,
        });

        detail.updateTotals();
        newDetails.push(detail);
      }

      invoice.details = await this.invoiceDetailRepository.save(newDetails);
      invoice.updateTotals();
    }

    await this.invoiceRepository.save(invoice);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    
    // Solo permitir eliminar facturas en borrador
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Solo se pueden eliminar facturas en estado borrador');
    }

    await this.invoiceRepository.remove(invoice);
  }

  async markAsPaid(id: string, paymentMethod?: string, paymentReference?: string): Promise<Invoice> {
    const invoice = await this.findOne(id);
    
    invoice.status = InvoiceStatus.PAID;
    invoice.paidDate = new Date();
    
    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod as any;
    }
    
    if (paymentReference) {
      invoice.paymentReference = paymentReference;
    }

    await this.invoiceRepository.save(invoice);
    return this.findOne(id);
  }

  async getInvoiceStats() {
    const totalInvoices = await this.invoiceRepository.count();
    const paidInvoices = await this.invoiceRepository.count({ 
      where: { status: InvoiceStatus.PAID } 
    });
    const pendingInvoices = await this.invoiceRepository.count({ 
      where: { status: InvoiceStatus.PENDING } 
    });
    const overdueInvoices = await this.invoiceRepository.count({ 
      where: { status: InvoiceStatus.OVERDUE } 
    });

    const totalRevenue = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PAID })
      .getRawOne();

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
    };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastInvoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.invoiceNumber LIKE :pattern', { pattern: `${year}-%` })
      .orderBy('invoice.invoiceNumber', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    return `${year}-${nextNumber.toString().padStart(6, '0')}`;
  }

  async createQuickInvoice(quickInvoiceDto: any): Promise<Invoice> {
    // Verificar que el cliente existe
    const customer = await this.userRepository.findOne({
      where: { id: quickInvoiceDto.customerId }
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que el producto existe y tiene stock suficiente
    const product = await this.productRepository.findOne({
      where: { id: quickInvoiceDto.productId }
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (product.stock < quickInvoiceDto.quantity) {
      throw new BadRequestException(
        `Stock insuficiente para el producto ${product.nombre}. Stock disponible: ${product.stock}, solicitado: ${quickInvoiceDto.quantity}`
      );
    }

    // Convertir a CreateInvoiceDto
    const createInvoiceDto = {
      customerId: quickInvoiceDto.customerId,
      customerName: quickInvoiceDto.customerName,
      customerEmail: quickInvoiceDto.customerEmail,
      customerPhone: quickInvoiceDto.customerPhone,
      taxPercentage: quickInvoiceDto.taxPercentage || 0,
      paymentMethod: quickInvoiceDto.paymentMethod,
      notes: quickInvoiceDto.notes,
      details: [
        {
          productId: quickInvoiceDto.productId,
          productName: product.nombre,
          productDescription: product.descripcion,
          productSku: product.sku,
          quantity: quickInvoiceDto.quantity,
          unitPrice: quickInvoiceDto.unitPrice || product.precio,
          discountPercentage: quickInvoiceDto.discountPercentage || 0,
          taxPercentage: quickInvoiceDto.taxPercentage || 0,
        }
      ]
    };

    return this.create(createInvoiceDto);
  }
}
