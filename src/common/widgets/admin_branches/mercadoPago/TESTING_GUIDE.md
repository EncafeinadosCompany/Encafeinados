# 🧪 Cómo Probar el Sistema de Pagos

## 🚀 Configuración Inicial

### 1. Variables de Entorno
Asegúrate de que tu archivo `.env` tenga las siguientes variables:

```bash
# Variables de entorno para MercadoPago
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-8f665586-ce12-4aed-827a-fb75877a9bdd
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-3145290160043378-070813-b430b32948df39fc5ae0da73862b4e79-2541020433
VITE_API_URL=http://localhost:3000/api/v2
```

### 2. Backend Funcionando
Verifica que el backend esté ejecutándose y tenga los endpoints:
- `GET /api/v2/branch-invoice/by-period/{branchId}` - Para obtener facturas
- `GET /api/v2/payments/invoice/{invoiceId}` - Para obtener URL de pago

## 🗂️ Rutas Disponibles para Pruebas

### 1. Página de Pruebas de MercadoPago (Pagos Individuales)
```
http://localhost:5173/payment-test
```
Esta página incluye múltiples escenarios de prueba con tarjetas de MercadoPago.

### 2. Módulo de Pagos por Sucursal
```
http://localhost:5173/sucursal/pagos
```
Esta es la nueva funcionalidad que lista las facturas de una sucursal.

## 🧪 Casos de Prueba para el Módulo de Pagos

### Caso 1: Lista de Facturas - Estado Inicial
1. Navega a `/sucursal/pagos`
2. **Resultado esperado:**
   - Se muestra el header con "Gestión de Pagos"
   - Se carga la lista de facturas de la sucursal #1
   - Facturas pagadas aparecen con borde verde y icono ✅
   - Facturas pendientes aparecen con borde naranja y icono ⏰

### Caso 2: Botón de Pago - Factura Pendiente
1. Busca una factura con `isPaid: false`
2. **Abre la consola del navegador (F12)**
3. Haz clic en el botón naranja "Pagar"
4. **Resultado esperado:**
   - El botón muestra "Procesando..." con spinner
   - **En la consola verás logs detallados:**
     ```
     Botón de pago clickeado para factura: [ID]
     🔄 Iniciando proceso de pago para factura: [ID]
     🌐 URL del endpoint: /payments/invoice/[ID]
     📥 Respuesta completa del servidor: [RESPUESTA]
     🔗 URL en respuesta: [URL_MERCADOPAGO]
     ✅ URL de pago válida obtenida: [URL_MERCADOPAGO]
     ```
   - Aparece toast verde "Redirigiendo a MercadoPago..."
   - Después de 1 segundo, serás redirigido a MercadoPago en la misma ventana

### Caso 2.1: Debug del Botón de Pago
Si el botón no funciona, revisa la consola para estos posibles errores:

#### Error: Backend no disponible
```
💥 Error completo procesando pago: AxiosError
📋 Detalles del error: { status: 500, message: "..." }
```
**Solución**: Verifica que el backend esté corriendo

#### Error: Endpoint no encontrado
```
💥 Error completo procesando pago: AxiosError
📋 Detalles del error: { status: 404, message: "Not Found" }
```
**Solución**: Confirma que el endpoint `/payments/invoice/{id}` existe

#### Error: URL no válida en respuesta
```
❌ No se encontró URL en la respuesta: { data: "..." }
```
**Solución**: El backend debe devolver `{ "url": "https://mercadopago..." }`

### Caso 3: Facturas Pagadas - Sin Botón
1. Busca una factura con `isPaid: true`
2. **Resultado esperado:**
   - No aparece botón de pago
   - Estado visual verde con "Pagada"
   - Icono de check verde

### Caso 4: Estados de Carga
1. Con network slow, navega a la página
2. **Resultado esperado:**
   - Skeleton loading animado
   - Placeholders para las facturas

### Caso 5: Manejo de Errores
1. Desconecta el backend
2. Navega a la página
3. **Resultado esperado:**
   - Mensaje de error con icono
   - Botón "Reintentar"
   - Al hacer clic en reintentar, vuelve a intentar la carga

## 🎯 Datos de Prueba

### Estructura de Factura Esperada
```json
{
  "branchId": 1,
  "branchName": "Sucursal Centro",
  "invoices": [
    {
      "invoiceId": 1,
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "totalVisits": 150,
      "totalAmount": "250000",
      "isPaid": false
    },
    {
      "invoiceId": 2,
      "startDate": "2024-02-01", 
      "endDate": "2024-02-29",
      "totalVisits": 200,
      "totalAmount": "350000",
      "isPaid": true
    }
  ]
}
```

### URL de Pago Esperada
```json
{
  "url": "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=123456789"
}
```

## 🔍 Verificación de Funcionalidades

### ✅ Lista de Verificación

- [ ] **Carga de datos:** La página carga las facturas correctamente
- [ ] **Estados visuales:** Facturas pagadas (verde) vs pendientes (naranja)
- [ ] **Botón de pago:** Solo aparece en facturas pendientes
- [ ] **Redirección:** Al hacer clic en pagar, abre MercadoPago
- [ ] **Responsividad:** Se ve bien en mobile, tablet y desktop
- [ ] **Animaciones:** Transiciones suaves al cargar elementos
- [ ] **Toast notifications:** Mensajes de éxito y error
- [ ] **Formateo de datos:** Fechas y montos formateados correctamente
- [ ] **Estadísticas:** Footer muestra total, pagadas y pendientes
- [ ] **Navegación:** Botón "Volver" funciona correctamente

### 🎨 Verificación Visual

- [ ] **Colores:** Fondo blanco, acentos naranjas, estados verdes/rojos
- [ ] **Iconos:** Lucide React icons cargando correctamente
- [ ] **Tipografía:** Jerarquía clara de textos
- [ ] **Espaciado:** Padding y margins consistentes
- [ ] **Bordes:** Rounded corners y shadows sutiles

## 🐛 Problemas Comunes y Soluciones

### Problema: "No se pudieron cargar las facturas"
**Solución:** 
1. Verificar que el backend esté funcionando
2. Revisar la URL del endpoint en las queries
3. Verificar que el branchId sea válido

### Problema: "Error al procesar el pago"
**Solución:**
1. Verificar que el endpoint `/payments/invoice/{id}` retorne una URL válida
2. Revisar que la factura no esté ya pagada
3. Verificar permisos y autenticación

### Problema: Estilos no se aplican
**Solución:**
1. Verificar que Tailwind CSS esté configurado
2. Revisar imports de CSS
3. Verificar que las clases de Tailwind sean válidas

### Problema: Iconos no aparecen
**Solución:**
1. Verificar import de `lucide-react`
2. Revisar que los nombres de iconos sean correctos
3. Verificar que la librería esté instalada

## 📱 Pruebas en Diferentes Dispositivos

### Mobile (< 768px)
- Layout vertical
- Botones más grandes
- Información apilada

### Tablet (768px - 1024px)
- Grid de 2-3 columnas
- Información parcialmente visible
- Navegación adaptada

### Desktop (> 1024px)
- Layout completo
- Toda la información visible
- Máximo aprovechamiento del espacio

## 🚀 Comando para Ejecutar

```bash
# Instalar dependencias si es necesario
npm install

# Ejecutar en desarrollo
npm run dev

# Navegar a la página de pruebas
# http://localhost:5173/sucursal/pagos
```
