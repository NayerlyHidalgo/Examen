import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { SuccessResponseDto, ErrorResponseDto } from '../common/dto/response.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    try {
      const invoice = await this.invoicesService.create(createInvoiceDto);
      return new SuccessResponseDto('Factura creada exitosamente', invoice);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('quick')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async createQuick(@Body() quickInvoiceDto: any) {
    try {
      const invoice = await this.invoicesService.createQuickInvoice(quickInvoiceDto);
      return new SuccessResponseDto('Factura rápida creada exitosamente', invoice);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() filterDto: InvoiceFilterDto) {
    try {
      const result = await this.invoicesService.findAll(filterDto);
      return new SuccessResponseDto('Facturas obtenidas exitosamente', result);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getStats() {
    try {
      const stats = await this.invoicesService.getInvoiceStats();
      return new SuccessResponseDto('Estadísticas de facturas obtenidas exitosamente', stats);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async findOne(@Param('id') id: string) {
    try {
      const invoice = await this.invoicesService.findOne(id);
      return new SuccessResponseDto('Factura obtenida exitosamente', invoice);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoicesService.update(id, updateInvoiceDto);
      return new SuccessResponseDto('Factura actualizada exitosamente', invoice);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/mark-as-paid')
  @Roles(UserRole.ADMIN)
  async markAsPaid(
    @Param('id') id: string,
    @Body() body: { paymentMethod?: string; paymentReference?: string },
  ) {
    try {
      const invoice = await this.invoicesService.markAsPaid(
        id,
        body.paymentMethod,
        body.paymentReference,
      );
      return new SuccessResponseDto('Factura marcada como pagada exitosamente', invoice);
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      await this.invoicesService.remove(id);
      return new SuccessResponseDto('Factura eliminada exitosamente');
    } catch (error) {
      return new ErrorResponseDto(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
