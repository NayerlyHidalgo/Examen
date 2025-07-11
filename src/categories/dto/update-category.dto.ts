import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  icono?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsNumber()
  @IsOptional()
  orden?: number;
}
