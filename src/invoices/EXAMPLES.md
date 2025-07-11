# Ejemplos de Uso del Sistema de Facturación

## 🚀 Ejemplos Prácticos

### 1. Crear una Factura Completa

```bash
POST /invoices
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "customerId": "uuid-del-cliente",
  "customerName": "María García",
  "customerEmail": "maria@email.com", 
  "customerPhone": "+1234567890",
  "customerAddress": "Av. Principal 123",
  "customerDocument": "1234567890",
  "customerDocumentType": "cedula",
  "issueDate": "2025-07-08",
  "dueDate": "2025-08-08", 
  "taxPercentage": 19,
  "discountPercentage": 5,
  "notes": "Factura por servicios de tatuaje",
  "terms": "Pago a 30 días",
  "details": [
    {
      "productId": "uuid-tinta-negra",
      "productName": "Tinta Negra Premium",
      "productDescription": "Tinta de alta calidad para tatuajes",
      "quantity": 2,
      "unitPrice": 25.00,
      "taxPercentage": 19
    },
    {
      "productId": "uuid-agujas",
      "productName": "Agujas Redondas #12", 
      "quantity": 5,
      "unitPrice": 15.00,
      "discountPercentage": 10,
      "taxPercentage": 19
    }
  ]
}
```

### 2. Crear una Factura Rápida (Un Solo Producto)

```bash
POST /invoices/quick
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "customerId": "uuid-del-cliente",
  "customerName": "Carlos Rodríguez",
  "customerEmail": "carlos@email.com",
  "customerPhone": "+1234567891", 
  "productId": "uuid-maquina-tatuaje",
  "quantity": 1,
  "unitPrice": 299.99,
  "taxPercentage": 19,
  "paymentMethod": "credit_card",
  "notes": "Venta de máquina de tatuaje profesional"
}
```

### 3. Buscar Facturas con Filtros

```bash
GET /invoices?status=paid&startDate=2025-01-01&endDate=2025-12-31&page=1&limit=10
Authorization: Bearer your-jwt-token
```

### 4. Obtener Estadísticas

```bash
GET /invoices/stats
Authorization: Bearer your-jwt-token

# Respuesta:
{
  "success": true,
  "message": "Estadísticas de facturas obtenidas exitosamente",
  "data": {
    "totalInvoices": 150,
    "paidInvoices": 120,
    "pendingInvoices": 25,
    "overdueInvoices": 5,
    "totalRevenue": 45678.90
  }
}
```

### 5. Marcar Factura como Pagada

```bash
PATCH /invoices/uuid-factura/mark-as-paid
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "paymentMethod": "credit_card",
  "paymentReference": "TXN123456789"
}
```

### 6. Actualizar una Factura

```bash
PATCH /invoices/uuid-factura
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "status": "pending",
  "customerPhone": "+1234567999",
  "notes": "Cliente cambió número de teléfono",
  "details": [
    {
      "productId": "uuid-producto",
      "productName": "Producto Actualizado",
      "quantity": 3,
      "unitPrice": 30.00,
      "taxPercentage": 19
    }
  ]
}
```

## 🎯 Casos de Uso Comunes

### Caso 1: Venta en Mostrador

1. Cliente llega al estudio
2. Selecciona productos (tintas, agujas, etc.)
3. Se crea factura rápida
4. Se marca como pagada inmediatamente

```javascript
// Frontend JavaScript
async function ventaMostrador(customerId, items) {
  // Crear factura
  const invoice = await fetch('/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customerId,
      customerName: 'Cliente Mostrador',
      paymentMethod: 'cash',
      details: items
    })
  });

  // Marcar como pagada
  if (invoice.ok) {
    const invoiceData = await invoice.json();
    await fetch(`/invoices/${invoiceData.data.id}/mark-as-paid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentMethod: 'cash'
      })
    });
  }
}
```

### Caso 2: Pedido Online con Pago Diferido

1. Cliente hace pedido online
2. Se crea factura en estado PENDING
3. Cliente paga después
4. Se actualiza estado a PAID

```javascript
async function pedidoOnline(customerId, items, dueDate) {
  const response = await fetch('/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customerId,
      dueDate,
      status: 'pending',
      details: items
    })
  });
  
  return response.json();
}
```

### Caso 3: Facturación para Estudios de Tatuaje

1. Estudio hace pedido mensual
2. Se crea factura con términos de pago
3. Se envía por email
4. Seguimiento de pagos

```javascript
async function facturaEstudio(studioId, monthlyOrder) {
  const invoice = await fetch('/invoices', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customerId: studioId,
      dueDate: new Date(Date.now() + 30*24*60*60*1000), // 30 días
      terms: 'Pago a 30 días. Descuento 2% por pago anticipado',
      details: monthlyOrder,
      taxPercentage: 19
    })
  });
  
  // Enviar por email (integración con módulo de mail)
  if (invoice.ok) {
    const invoiceData = await invoice.json();
    await sendInvoiceByEmail(invoiceData.data);
  }
}
```

## 📊 Dashboard de Facturación

### Componente React de Ejemplo

```jsx
import React, { useState, useEffect } from 'react';

function InvoiceDashboard() {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    // Cargar estadísticas
    fetch('/invoices/stats')
      .then(res => res.json())
      .then(data => setStats(data.data));

    // Cargar facturas
    const params = new URLSearchParams(filters);
    fetch(`/invoices?${params}`)
      .then(res => res.json())
      .then(data => setInvoices(data.data));
  }, [filters]);

  return (
    <div className="invoice-dashboard">
      {/* Estadísticas */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Facturas</h3>
            <p>{stats.totalInvoices}</p>
          </div>
          <div className="stat-card">
            <h3>Ingresos Totales</h3>
            <p>${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Pendientes</h3>
            <p>{stats.pendingInvoices}</p>
          </div>
          <div className="stat-card">
            <h3>Vencidas</h3>
            <p>{stats.overdueInvoices}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filters">
        <select 
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagada</option>
          <option value="overdue">Vencida</option>
        </select>
      </div>

      {/* Lista de facturas */}
      <div className="invoices-list">
        {invoices.data?.map(invoice => (
          <div key={invoice.id} className="invoice-item">
            <h4>{invoice.invoiceNumber}</h4>
            <p>{invoice.customerName}</p>
            <p>${invoice.total}</p>
            <span className={`status ${invoice.status}`}>
              {invoice.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Configuración de Testing

### Test de Integración

```javascript
describe('Invoices Integration', () => {
  it('should create complete invoice workflow', async () => {
    // 1. Crear factura
    const createResponse = await request(app)
      .post('/invoices')
      .send(sampleInvoiceData)
      .expect(201);

    const invoice = createResponse.body.data;
    
    // 2. Verificar cálculos
    expect(invoice.total).toBeGreaterThan(0);
    expect(invoice.details.length).toBeGreaterThan(0);

    // 3. Marcar como pagada
    await request(app)
      .patch(`/invoices/${invoice.id}/mark-as-paid`)
      .send({ paymentMethod: 'cash' })
      .expect(200);

    // 4. Verificar estado
    const updatedInvoice = await request(app)
      .get(`/invoices/${invoice.id}`)
      .expect(200);

    expect(updatedInvoice.body.data.status).toBe('paid');
  });
});
```

## 📱 Frontend Mobile

### Flutter/React Native Example

```dart
class InvoiceService {
  static const String baseUrl = 'https://api.tattoo-shop.com';
  
  Future<Invoice> createQuickInvoice({
    required String customerId,
    required String customerName,
    required String productId,
    required int quantity,
    double? unitPrice,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/invoices/quick'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'customerId': customerId,
        'customerName': customerName,
        'productId': productId,
        'quantity': quantity,
        'unitPrice': unitPrice,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Invoice.fromJson(data['data']);
    } else {
      throw Exception('Failed to create invoice');
    }
  }
}
```

Este sistema de facturación te proporciona una solución completa para manejar las ventas en tu tienda de implementos para tatuajes, con toda la funcionalidad necesaria para crear, gestionar y dar seguimiento a las facturas de tus clientes.
