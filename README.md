# Tattoo Shop Backend - Examen Final Parcial 4

Sistema de e-commerce para tienda de implementos de tatuaje desarrollado con NestJS.

## Descripción

Este proyecto es un sistema completo de e-commerce para una tienda de implementos de tatuaje que incluye:

- 🛍️ Catálogo de productos público
- 🛒 Carrito de compras con cálculo de IVA (19%)
- 💳 Procesamiento de pagos
- 📦 Gestión de órdenes
- 👥 Sistema de usuarios
- 🔐 Autenticación y autorización
- 📊 Panel de administración

## Características Principales

### Frontend Público
- Catálogo de productos con filtros
- Carrito de compras con cálculo de IVA (19%)
- Checkout para clientes invitados
- Confirmación de órdenes
- **Formateo de precios corregido a 2 decimales**

### Backend API
- API RESTful con NestJS
- Base de datos con TypeORM
- Autenticación JWT
- Validación de datos
- Gestión de archivos

### Panel de Administración
- Gestión de productos
- Gestión de categorías
- Gestión de órdenes
- Gestión de usuarios

## Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL/MySQL con TypeORM
- **Autenticación**: JWT, Passport
- **Frontend**: Handlebars, Bootstrap
- **Validación**: class-validator

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NayerlyHidalgo/Examen.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run start:dev
```

## Configuración

Crear un archivo `.env` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=tattoo_shop
JWT_SECRET=tu_jwt_secret
```

## Uso

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## Endpoints Principales

### Público
- `GET /tienda` - Catálogo de productos
- `GET /tienda/producto/:id` - Detalle de producto
- `GET /tienda/carrito` - Carrito de compras
- `POST /tienda/checkout` - Procesar compra
- `GET /tienda/orden/:orderNumber` - Confirmación de orden

### API
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /products` - Listar productos
- `POST /products` - Crear producto
- `GET /orden` - Listar órdenes
- `POST /orden` - Crear orden

## Características del Sistema

### Cálculo de Precios (Corregido)
- Subtotal de productos
- IVA del 19% con redondeo preciso
- Envío gratis para compras superiores a $100
- **Formato de precios con exactamente 2 decimales**

### Gestión de Órdenes
- Órdenes para usuarios registrados
- Órdenes para clientes invitados
- Estados de orden (Pendiente, Procesando, Enviado, Entregado)
- Métodos de pago (Tarjeta de crédito, Tarjeta de débito)

## Últimas Mejoras

### Formateo de Precios
- ✅ Implementado redondeo preciso usando `Math.round(value * 100) / 100`
- ✅ Todos los precios se muestran con exactamente 2 decimales
- ✅ Cálculo de IVA corregido para evitar decimales largos
- ✅ Frontend y backend sincronizados para mostrar precios consistentes

### Limpieza del Código
- ✅ Eliminados archivos de prueba obsoletos
- ✅ Removidos scripts y documentación no relevante
- ✅ Código optimizado y funcional

## Acceso a la Aplicación

Una vez ejecutado el servidor, la aplicación estará disponible en:
- **Tienda pública**: http://localhost:3001/tienda
- **Panel de administración**: http://localhost:3001/admin
- **API**: http://localhost:3001/api

## Autor

**Examen Final Parcial 4**
- Repositorio: https://github.com/NayerlyHidalgo/Examen.git
- Desarrollado con NestJS y TypeScript

## Licencia

Este proyecto está bajo la Licencia MIT.
