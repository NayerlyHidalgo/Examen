import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  direccion?: string;

  @IsOptional()
  ciudad?: string;

  @IsOptional()
  codigoPostal?: string;

  @IsOptional()
  pais?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  profile?: string;

  @IsOptional()
  fechaNacimiento?: Date;

  @IsOptional()
  estudioTatuaje?: string;

  @IsOptional()
  aniosExperiencia?: number;

  @IsOptional()
  especialidades?: string;
}
