import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './invoice.entity';
import { InvoiceDetail } from './invoice-detail.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceDetail, User, Product]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, ProductsService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
