# Estructura de Tienda Pública y Privada

## 🏪 Descripción General

La aplicación ahora tiene dos secciones principales:

### 📍 **Tienda Pública** (`/tienda`)
- **Acceso**: Sin necesidad de registro/login
- **Funcionalidades**:
  - Ver todos los productos
  - Buscar y filtrar productos
  - Ver detalles de productos
  - Agregar productos al carrito (localStorage)
  - Realizar compras como invitado
  - Pago con tarjeta de crédito/débito
  - Confirmación de orden

### 🔐 **Tienda Privada** (`/shop`)
- **Acceso**: Requiere login/registro
- **Funcionalidades**:
  - Todas las funcionalidades de la tienda pública
  - Historial de compras
  - Perfil de usuario
  - Guardar direcciones
  - Seguimiento de órdenes
  - Wishlist (lista de deseos)

## 🛣️ Rutas Principales

### Tienda Pública
- `GET /tienda` - Catálogo principal
- `GET /tienda/producto/:id` - Detalles del producto
- `GET /tienda/carrito` - Carrito de compras
- `POST /tienda/checkout` - Procesamiento de compra
- `GET /tienda/orden/:orderNumber` - Confirmación de orden

### Tienda Privada
- `GET /shop` - Catálogo para usuarios autenticados
- `GET /shop/profile` - Perfil del usuario
- `GET /shop/orders` - Historial de órdenes
- `GET /shop/wishlist` - Lista de deseos

### Autenticación
- `GET /auth/login` - Página de login
- `GET /auth/register` - Página de registro
- `POST /auth/login` - Procesar login
- `POST /auth/register` - Procesar registro

### Administración
- `GET /admin/dashboard` - Dashboard admin
- Todas las rutas de administración existentes

## 🎯 Flujo de Usuario

### 1. Visitante Nuevo
1. Visita `/` → Redirige a `/tienda`
2. Navega productos públicamente
3. Agrega productos al carrito
4. Realiza compra como invitado
5. Recibe confirmación de orden

### 2. Usuario Registrado
1. Visita `/` → Redirige a `/shop` (si está autenticado)
2. Tiene acceso a funcionalidades adicionales
3. Historial de compras
4. Perfil personalizado

### 3. Administrador
1. Visita `/` → Redirige a `/admin/dashboard`
2. Acceso completo a todas las funcionalidades admin
3. Gestión de productos, usuarios, órdenes

## 💳 Sistema de Pagos

### Información Requerida
- **Cliente**: Nombre, apellido, email, teléfono
- **Pago**: Número de tarjeta, fecha vencimiento, CVV
- **Método**: Tarjeta de crédito o débito

### Procesamiento
- Validación de datos de tarjeta
- Simulación de procesamiento de pago
- Generación de número de orden único
- Envío de confirmación

### Integración Futura
- Stripe, PayPal, MercadoPago
- Webhooks para confirmaciones
- Manejo de reembolsos

## 📊 Base de Datos

### Órdenes de Invitados
```sql
-- Campos adicionales en la tabla ordenes
orderNumber VARCHAR(255) UNIQUE -- Número de orden único
guestCustomerInfo JSON -- Información del cliente invitado
paymentInfo JSON -- Información del pago
usuarioId VARCHAR(255) NULL -- Permitir null para invitados
```

### Estructura de Datos
```json
{
  "guestCustomerInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "phone": "+1234567890"
  },
  "paymentInfo": {
    "method": "credit-card",
    "cardType": "Visa",
    "lastFour": "1234",
    "status": "completed"
  }
}
```

## 🔧 Configuración Técnica

### Middleware
- `AdminAuthMiddleware`: Protege rutas privadas
- Rutas públicas excluidas: `/tienda`, `/auth/*`, `/api/*`

### Vistas
- `public-shop/`: Vistas para tienda pública
- `shop/`: Vistas para tienda privada
- `auth/`: Vistas de autenticación
- `admin/`: Vistas de administración

### Controladores
- `PublicShopController`: Maneja la tienda pública
- `ShopController`: Maneja la tienda privada
- `AuthWebController`: Maneja autenticación web
- `AdminController`: Maneja funcionalidades admin

## 🚀 Próximos Pasos

1. **Integración de pagos real**
   - Stripe, PayPal, MercadoPago
   - Webhooks y confirmaciones

2. **Funcionalidades adicionales**
   - Wishlist para usuarios registrados
   - Comparador de productos
   - Reseñas y calificaciones

3. **Optimizaciones**
   - Cache de productos
   - Optimización de imágenes
   - Búsqueda avanzada

4. **Seguridad**
   - Rate limiting
   - Validación de datos
   - Protección CSRF

## 🧪 Pruebas

### Tienda Pública
1. Ir a `/tienda`
2. Navegar productos
3. Agregar al carrito
4. Realizar compra como invitado
5. Verificar confirmación

### Tienda Privada
1. Registrarse/iniciar sesión
2. Ir a `/shop`
3. Verificar funcionalidades adicionales
4. Probar historial de órdenes

### Administración
1. Login como admin: `melifer.j1995@gmail.com` / `M3l5N128.12`
2. Acceder a `/admin/dashboard`
3. Verificar todas las funcionalidades admin
