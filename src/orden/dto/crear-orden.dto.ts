export interface OrdenProductoDto {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CrearOrdenDto {
  usuarioId: string;
  productos: OrdenProductoDto[];
}
