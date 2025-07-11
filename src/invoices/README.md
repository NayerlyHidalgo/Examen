# Sistema de Facturación

Este módulo proporciona un sistema completo de facturación para la tienda de implementos de tatuajes.

## Características

### ✨ Funcionalidades Principales

- **Gestión de Facturas**: Crear, leer, actualizar y eliminar facturas
- **Información de Cliente**: Almacena datos completos del cliente en cada factura
- **Detalles de Productos**: Mantiene información histórica de productos y precios
- **Cálculos Automáticos**: Subtotales, impuestos, descuentos y totales
- **Estados de Factura**: Draft, Pending, Paid, Cancelled, Overdue
- **Métodos de Pago**: Efectivo, tarjetas, transferencias, PayPal, etc.
- **Numeración Automática**: Números de factura únicos y consecutivos
- **Filtros y Búsqueda**: Filtrado avanzado y búsqueda de facturas
- **Estadísticas**: Dashboard con métricas de facturación

## Entidades

### Invoice (Factura)
- **Información básica**: Número, fecha, estado, vencimiento
- **Cliente**: Relación con usuario + datos históricos del cliente
- **Totales**: Subtotal, impuestos, descuentos, total final
- **Pago**: Método de pago, referencia, fecha de pago
- **Metadata**: Notas, términos y condiciones

### InvoiceDetail (Detalle de Factura)
- **Producto**: Relación con producto + datos históricos
- **Cantidades**: Cantidad, precio unitario
- **Descuentos**: Por línea (porcentaje y monto)
- **Impuestos**: Por línea
- **Cálculos**: Total por línea

## Endpoints API

### Facturas
```
POST   /invoices              # Crear factura
GET    /invoices              # Listar facturas (con filtros)
GET    /invoices/stats        # Estadísticas
GET    /invoices/:id          # Obtener factura específica
PATCH  /invoices/:id          # Actualizar factura
PATCH  /invoices/:id/mark-as-paid  # Marcar como pagada
DELETE /invoices/:id          # Eliminar factura (solo draft)
```

### Filtros Disponibles
- `status`: Estado de la factura
- `customerId`: ID del cliente
- `invoiceNumber`: Número de factura
- `startDate` / `endDate`: Rango de fechas
- `paymentMethod`: Método de pago
- `search`: Búsqueda general
- `page` / `limit`: Paginación

## Ejemplo de Uso

### Crear una Factura

```typescript
const createInvoiceDto = {
  customerId: "uuid-del-cliente",
  customerName: "Juan Pérez",
  customerEmail: "juan@email.com",
  customerPhone: "+1234567890",
  customerAddress: "Calle Principal 123",
  customerDocument: "1234567890",
  customerDocumentType: "cedula",
  issueDate: "2025-07-08",
  dueDate: "2025-08-08",
  taxPercentage: 19,
  notes: "Factura por servicios de tatuaje",
  details: [
    {
      productId: "uuid-del-producto",
      productName: "Tinta Negra Premium",
      quantity: 2,
      unitPrice: 25.00,
      taxPercentage: 19
    },
    {
      productId: "uuid-del-producto-2",
      productName: "Agujas Redondas #12",
      quantity: 5,
      unitPrice: 15.00,
      discountPercentage: 10
    }
  ]
};

const response = await fetch('/invoices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(createInvoiceDto)
});
```

### Buscar Facturas

```typescript
const params = new URLSearchParams({
  status: 'paid',
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  page: '1',
  limit: '10',
  search: 'Juan'
});

const response = await fetch(`/invoices?${params}`);
```

### Marcar como Pagada

```typescript
const response = await fetch('/invoices/uuid-factura/mark-as-paid', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentMethod: 'credit_card',
    paymentReference: 'TXN123456'
  })
});
```

## Estados de Factura

- **DRAFT**: Borrador, puede editarse y eliminarse
- **PENDING**: Pendiente de pago
- **PAID**: Pagada
- **CANCELLED**: Cancelada
- **OVERDUE**: Vencida

## Métodos de Pago

- **CASH**: Efectivo
- **CREDIT_CARD**: Tarjeta de crédito
- **DEBIT_CARD**: Tarjeta de débito
- **BANK_TRANSFER**: Transferencia bancaria
- **PAYPAL**: PayPal
- **OTHER**: Otro

## Validaciones

- Los productos deben existir y tener stock suficiente
- El cliente debe existir en el sistema
- Las cantidades deben ser positivas
- Los porcentajes de descuento e impuesto deben ser válidos
- Solo las facturas en estado DRAFT pueden eliminarse
- Los cálculos se actualizan automáticamente

## Cálculos Automáticos

### Por Línea de Detalle
1. Subtotal = cantidad × precio_unitario
2. Descuento = subtotal × (descuento_porcentaje / 100)
3. Base_gravable = subtotal - descuento
4. Impuesto = base_gravable × (impuesto_porcentaje / 100)
5. Total_línea = base_gravable + impuesto

### Por Factura
1. Subtotal = suma de todos los subtotales de líneas
2. Impuesto_total = suma de todos los impuestos de líneas
3. Descuento_total = descuento_factura + suma_descuentos_líneas
4. Total_final = subtotal + impuesto_total - descuento_total

## Permisos y Seguridad

- **ADMIN**: Acceso completo a todas las facturas
- **CUSTOMER**: Solo puede ver sus propias facturas
- Autenticación JWT requerida
- Validación de roles con guards

## Notas Técnicas

- Utiliza TypeORM para persistencia
- Relaciones eager loading para optimizar consultas
- Soft deletes para mantener historial
- Transacciones para garantizar consistencia
- Validación con class-validator
- Respuestas estandarizadas con DTOs
