# Módulo de Pagos por Sucursal

Este módulo permite gestionar y procesar pagos de facturas por sucursal usando MercadoPago como pasarela de pago.

## Componentes

### PaymentsByBranchWidget
Widget principal que muestra la lista de facturas de una sucursal y permite procesar pagos.

**Props:**
- `branchId: number` - ID de la sucursal
- `onPaymentSuccess?: (invoiceId: number) => void` - Callback cuando un pago se inicia exitosamente

### PaymentsByBranchView
Vista completa para la gestión de pagos con header, navegación y información adicional.

**Props:**
- `branchId?: number` - ID de la sucursal (opcional, por defecto 1)

## Funcionalidades

- ✅ Lista todas las facturas de una sucursal
- ✅ Muestra estado de pago (Pagada/Pendiente) con colores distintivos
- ✅ Botón de pago para facturas pendientes
- ✅ Integración con MercadoPago (redirección externa)
- ✅ Resumen de estadísticas (total, pagadas, pendientes)
- ✅ Animaciones suaves con Framer Motion
- ✅ Diseño responsive y mobile-first
- ✅ Estados de carga y error

## Diseño

### Colores
- **Fondo:** Blanco (`bg-white`)
- **Acentos:** Naranja (`orange-500`, `orange-600`)
- **Estados de éxito:** Verde (`green-500`, `green-600`)
- **Estados de error:** Rojo (`red-500`, `red-600`)
- **Estados pendientes:** Amarillo/Naranja (`orange-500`, `yellow-500`)
- **Texto principal:** Negro/Gris oscuro (`gray-900`)
- **Texto secundario:** Gris (`gray-600`)

### Elementos visuales
- Tarjetas con bordes redondeados y sombras suaves
- Iconos de Lucide React para cada elemento
- Gradientes en el header informativo
- Estados visuales claros para cada tipo de factura

## Uso

### En el Router
```tsx
<Route path="pagos" element={<PaymentsByBranchView/>} />
```

### Como Widget independiente
```tsx
<PaymentsByBranchWidget 
  branchId={1}
  onPaymentSuccess={(invoiceId) => {
    console.log(`Pago iniciado para factura ${invoiceId}`);
  }}
/>
```

## APIs utilizadas

### Queries
- `useInvoicesByBranch(branchId)` - Obtiene las facturas de una sucursal
- `registerPaymentMethod(invoiceId)` - Obtiene la URL de pago de MercadoPago

### Tipos
- `InvoiceByBranchResponse` - Respuesta con datos de la sucursal y facturas
- `invoicesBranch` - Estructura de una factura individual

## Flujo de Pago

1. Usuario ve la lista de facturas
2. Hace clic en "Pagar" para una factura pendiente
3. Se llama a `registerPaymentMethod(invoiceId)`
4. Se obtiene la URL de MercadoPago
5. Se abre una nueva ventana/tab con la URL de pago
6. Usuario completa el pago en MercadoPago
7. Al regresar, el sistema se actualiza automáticamente

## Estados de la Interfaz

### Carga
- Skeleton loading para la lista de facturas
- Spinner en botones durante procesamiento

### Error
- Mensaje de error con botón de reintentar
- Toast notifications para errores específicos

### Éxito
- Estados visuales claros para facturas pagadas
- Toast notifications para acciones exitosas
- Animaciones de confirmación

### Vacío
- Mensaje informativo cuando no hay facturas
- Icono ilustrativo del estado

## Responsive Design

- **Mobile:** Stack vertical, botones más grandes
- **Tablet:** Grid de 2 columnas para información
- **Desktop:** Layout completo con toda la información visible

## Accesibilidad

- Contraste adecuado en todos los elementos
- Textos alternativos en iconos
- Estados de focus claros
- Navegación por teclado

## Dependencias

- React Query para gestión de estado
- Framer Motion para animaciones
- Lucide React para iconos
- React Hot Toast para notificaciones
- React Router para navegación
