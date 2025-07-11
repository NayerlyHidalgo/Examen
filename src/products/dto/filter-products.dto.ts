import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioMax?: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @IsString()
  ordenarPor?: 'precio' | 'nombre' | 'fecha' | 'popularidad';

  @IsOptional()
  @IsString()
  direccion?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limite?: number;
}
