import { Controller, Get, Render, Param, Query, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.entity';

@Controller('web/invoices')
export class InvoicesWebController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @Render('invoices/dashboard-dynamic')
  async dashboard(@Query() query: any, @Headers('accept') accept: string) {
    const stats = await this.invoicesService.getInvoiceStats();
    const invoices = await this.invoicesService.findAll({
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
      search: query.search,
      startDate: query.startDate,
      endDate: query.endDate,
    });

    return {
      title: 'Panel de Facturas',
      stats,
      invoices,
      query,
      isAjax: accept?.includes('application/json'),
    };
  }

  @Get('create')
  @Render('invoices/create-dynamic')
  async create() {
    return {
      title: 'Crear Factura',
      invoice: {
        id: null,
        numero: '',
        fecha: new Date().toISOString().split('T')[0],
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cliente: {
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
        },
        items: [],
        subtotal: 0,
        impuestos: 0,
        total: 0,
        estado: 'borrador',
        notas: '',
      },
    };
  }

  @Get(':id')
  @Render('invoices/detail-dynamic')
  async detail(@Param('id') id: string) {
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) {
      return {
        title: 'Factura no encontrada',
        error: 'La factura solicitada no existe',
      };
    }
    return {
      title: `Factura ${invoice.invoiceNumber}`,
      invoice,
    };
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    try {
      // TODO: Implementar generación de PDF
      // const pdfBuffer = await this.invoicesService.generatePdf(invoice);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', `attachment; filename="factura-${invoice.invoiceNumber}.pdf"`);
      // res.send(pdfBuffer);
      res.status(501).json({ error: 'Generación de PDF no implementada' });
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({ error: 'Error al generar PDF' });
    }
  }

  @Get('api/products')
  async getProducts(@Query('search') search?: string) {
    try {
      // Obtener productos reales de la base de datos
      const products = await this.productsService.findAll();
      
      let productList: Product[] = products?.data || [];
      
      // Si no hay productos, usar datos de ejemplo simples
      if (productList.length === 0) {
        const sampleProducts = [
          {
            id: '1',
            name: 'Máquina de Tatuar Premium',
            description: 'Máquina profesional de alta calidad',
            price: 250000,
            stock: 10,
            brand: 'TattooMaster',
            model: 'TM-2024',
            sku: 'TM-MT-001',
            category: 'Máquinas',
            available: true,
            featured: true,
            discount: 10,
          },
          {
            id: '2',
            name: 'Aguja Liner 03',
            description: 'Aguja para líneas finas',
            price: 15000,
            stock: 50,
            brand: 'NeedlePro',
            model: 'NP-03L',
            sku: 'NP-AGL-003',
            category: 'Agujas',
            available: true,
            featured: false,
            discount: 0,
          },
        ];
        
        return {
          success: true,
          data: search ? 
            sampleProducts.filter(product => 
              product.name.toLowerCase().includes(search.toLowerCase()) ||
              product.description.toLowerCase().includes(search.toLowerCase())
            ) : sampleProducts,
          total: sampleProducts.length,
        };
      }
      
      // Formatear productos reales de la base de datos
      if (search) {
        productList = productList.filter(product => 
          product.nombre.toLowerCase().includes(search.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
          product.marca?.toLowerCase().includes(search.toLowerCase()) ||
          product.sku?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Formatear datos para el frontend
      const formattedProducts = productList.map(product => ({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        description: product.descripcion,
        stock: product.stock,
        brand: product.marca,
        model: product.modelo,
        sku: product.sku,
        category: product.categoria?.name || 'General',
        available: product.disponible,
        featured: product.destacado,
        discount: product.descuento || 0,
      }));
      
      return {
        success: true,
        data: formattedProducts,
        total: formattedProducts.length,
      };
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
        data: [],
      };
    }
  }
}
