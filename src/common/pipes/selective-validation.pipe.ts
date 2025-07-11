import { ValidationPipe, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SelectiveValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Lista de rutas que deben omitir la validación
    const excludedRoutes = [
      'auth/register',
      'auth/login'
    ];
    
    // Si la ruta está en la lista de exclusión, devolver el valor sin validar
    if (metadata.data && typeof metadata.data === 'string' && excludedRoutes.some(route => metadata.data?.includes(route))) {
      return value;
    }
    
    // Para todas las demás rutas, usar validación normal
    return super.transform(value, metadata);
  }
}
