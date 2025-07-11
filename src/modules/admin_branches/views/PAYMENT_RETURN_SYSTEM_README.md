# 🔄 Sistema de Retorno de Pagos - MercadoPago

## 📋 Descripción
Sistema completo para manejar el retorno de usuarios desde MercadoPago después de realizar un pago, incluyendo vistas para éxito, error, pendiente y estados desconocidos.

## 🛣️ Rutas de Retorno

### Ruta Principal
```
/payment/result
```

### Parámetros Esperados de MercadoPago
- `status` - Estado del pago (approved, rejected, pending, etc.)
- `payment_id` - ID del pago en MercadoPago
- `merchant_order_id` - ID de la orden del comercio
- `preference_id` - ID de la preferencia
- `collection_status` - Estado de la colección

### URLs de Retorno Configuradas
El sistema configura automáticamente estas URLs:

```javascript
const returnUrls = {
  success: `${baseUrl}/payment/result?status=approved&invoice_id=${invoiceId}`,
  failure: `${baseUrl}/payment/result?status=rejected&invoice_id=${invoiceId}`,
  pending: `${baseUrl}/payment/result?status=pending&invoice_id=${invoiceId}`
};
```

## 🎨 Estados Visuales

### ✅ Pago Exitoso (Success)
- **Condición**: `status=approved` OR `collection_status=approved`
- **Color**: Verde
- **Icono**: CheckCircle
- **Mensaje**: "¡Pago Exitoso! 🎉"
- **Acción**: Redirige automáticamente a `/sucursal/pagos`

### ❌ Pago Rechazado (Error)
- **Condición**: `status=rejected|failure` OR `collection_status=rejected`
- **Color**: Rojo
- **Icono**: XCircle
- **Mensaje**: "Pago Rechazado ❌"
- **Acción**: Permite volver a intentar

### ⏳ Pago Pendiente (Pending)
- **Condición**: `status=pending` OR `collection_status=pending`
- **Color**: Amarillo
- **Icono**: Clock
- **Mensaje**: "Pago Pendiente ⏳"
- **Acción**: Informa que se notificará cuando esté listo

### ❓ Estado Desconocido (Unknown)
- **Condición**: Cualquier otro estado o parámetros faltantes
- **Color**: Gris
- **Icono**: CreditCard
- **Mensaje**: "Estado Desconocido"
- **Acción**: Solicita contactar soporte

## 🔧 Configuración del Backend

### Endpoint Modificado
El endpoint `/payments/invoice/{id}` ahora debe recibir un POST con las URLs de retorno:

```javascript
POST /api/v2/payments/invoice/{invoiceId}
Content-Type: application/json

{
  "return_urls": {
    "success": "https://tudominio.com/payment/result?status=approved&invoice_id=123",
    "failure": "https://tudominio.com/payment/result?status=rejected&invoice_id=123", 
    "pending": "https://tudominio.com/payment/result?status=pending&invoice_id=123"
  }
}
```

### Respuesta Esperada
```javascript
{
  "url": "https://www.mercadopago.com/mco/checkout/start?pref_id=..."
}
```

## 📱 Funcionalidades de la Vista

### Redirección Automática
- Countdown de 5 segundos
- Redirige automáticamente a `/sucursal/pagos`
- El usuario puede cancelar y volver manualmente

### Información Mostrada
- Estado del pago con iconos y colores
- ID del pago (si está disponible)
- ID de la orden del comercio
- Mensaje descriptivo del estado
- Botón para volver a la lista de pagos

### Animaciones
- Entrada suave con Framer Motion
- Icono animado con efecto spring
- Elementos aparecen secuencialmente

### Debug en Desarrollo
- Muestra todos los parámetros recibidos
- Útil para debugging y desarrollo
- Solo visible en `NODE_ENV=development`

## 🧪 Pruebas

### URLs de Prueba Locales
```bash
# Pago exitoso
http://localhost:5173/payment/result?status=approved&payment_id=123&invoice_id=456

# Pago rechazado  
http://localhost:5173/payment/result?status=rejected&payment_id=123&invoice_id=456

# Pago pendiente
http://localhost:5173/payment/result?status=pending&payment_id=123&invoice_id=456

# Estado desconocido
http://localhost:5173/payment/result?status=unknown&invoice_id=456
```

### Flujo Completo de Prueba
1. Ir a `/sucursal/pagos`
2. Hacer clic en "Pagar" en una factura pendiente
3. Completar el pago en MercadoPago (sandbox)
4. Ser redirigido a `/payment/result` con parámetros
5. Ver la pantalla de resultado correspondiente
6. Esperar redirección automática o hacer clic en "Volver"

## 🔄 Flujo Técnico

### 1. Inicio de Pago
```
Usuario → Click "Pagar" → Widget configura URLs de retorno → POST al backend
```

### 2. Procesamiento
```
Backend → Crea preferencia en MercadoPago → Incluye URLs de retorno → Retorna URL
```

### 3. Pago en MercadoPago
```
Usuario → Completa pago → MercadoPago redirige → /payment/result?params
```

### 4. Resultado
```
Vista de resultado → Muestra estado → Redirección automática → /sucursal/pagos
```

## 📝 Archivos Involucrados

### Vista Principal
- `payment_result.view.tsx` - Vista de resultados

### Widget de Pagos
- `payment.widget.tsx` - Maneja inicio de pagos con URLs de retorno

### Router
- `index.tsx` - Ruta `/payment/result` añadida

### Estilos
- Usa componentes existentes (Card, CardContent)
- Tailwind CSS para responsive design
- Framer Motion para animaciones

## 🚀 Despliegue en Producción

### Variables de Entorno
Asegúrate de que el backend tenga configuradas las URLs correctas:

```bash
# En desarrollo
FRONTEND_URL=http://localhost:5173

# En producción  
FRONTEND_URL=https://tudominio.com
```

### URLs de Retorno Dinámicas
El sistema detecta automáticamente el dominio usando `window.location.origin`, por lo que funciona tanto en desarrollo como en producción sin cambios.

## 🛠️ Personalización

### Modificar Timeout de Redirección
```javascript
const [countdown, setCountdown] = useState(10); // Cambiar de 5 a 10 segundos
```

### Cambiar Destino de Redirección
```javascript
navigate('/otra-ruta'); // Cambiar destino
```

### Añadir Nuevos Estados
```javascript
case 'nuevo-estado':
  return {
    icon: NuevoIcono,
    color: 'purple',
    // ... configuración
  };
```

## 📋 Lista de Verificación

### Backend
- [ ] Endpoint acepta POST con `return_urls`
- [ ] MercadoPago configurado con URLs de retorno
- [ ] Logs para debugging de URLs

### Frontend  
- [ ] Ruta `/payment/result` funcionando
- [ ] Manejo de todos los estados de pago
- [ ] Redirección automática operativa
- [ ] URLs generadas correctamente

### Testing
- [ ] Probar con pagos de sandbox
- [ ] Verificar todos los estados posibles
- [ ] Confirmar redirecciones
- [ ] Validar responsive design
