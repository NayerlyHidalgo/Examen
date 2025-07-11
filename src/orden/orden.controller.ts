import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdenService, CrearOrdenDto } from './orden.service';

@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  crearOrden(@Body() dto: CrearOrdenDto) {
    return this.ordenService.crearOrden(dto);
  }

  @Get()
  getAllOrdenes() {
    return this.ordenService.getAllOrdenes();
  }

  @Get('usuario/:usuarioId')
  obtenerOrdenesPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.ordenService.obtenerOrdenesPorUsuario(usuarioId);
  }

  @Get(':id')
  obtenerOrdenPorId(@Param('id') id: string) {
    return this.ordenService.obtenerOrdenPorId(id);
  }
}
