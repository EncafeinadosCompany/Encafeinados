# 📱 Vista de Dashboard de Pagos - Diseño Minimalista

## 🎯 Descripción
Vista minimalista y responsiva para la gestión de pagos por sucursal. Inspirada en el dashboard de estampas pero optimizada para la gestión de facturas y pagos.

## ✨ Características

### 📊 Estadísticas Minimalistas
- **Total de facturas**: Número total de facturas
- **Facturas pagadas**: Con indicador verde
- **Facturas pendientes**: Con indicador naranja  
- **Monto total**: Suma de todas las facturas

### 🎨 Diseño
- **Colores**: Blanco, naranja, negro y grises
- **Tipografía**: Jerárquica y legible
- **Espaciado**: Optimizado para todas las pantallas
- **Animaciones**: Suaves y discretas

### 📱 Responsividad
- **Mobile**: Grid 2x2 para las estadísticas
- **Tablet**: Mantiene diseño compacto
- **Desktop**: Grid 1x4 para estadísticas

## 🛣️ Ruta de Acceso
```
/sucursal/pagos
```

## 🧩 Componentes Utilizados

### Principales
- `PaymentsByBranchWidget` - Lista detallada de facturas
- `StatCard` - Tarjetas de estadísticas minimalistas
- `Card` y `CardContent` - Contenedores base

### Iconos (Lucide React)
- `CreditCard` - Total de facturas
- `CheckCircle` - Facturas pagadas
- `Clock` - Facturas pendientes
- `DollarSign` - Monto total

## 📐 Estructura de Layout

### Header
```
📱 Gestión de Pagos 💳
   Nombre de la sucursal
```

### Estadísticas (Grid responsivo)
```
[Total]    [Pagadas]
[Pendientes] [Monto]
```

### Widget Principal
- Lista completa de facturas
- Botones de pago para facturas pendientes
- Estados visuales claros

### Footer
- Resumen rápido con indicadores de color
- Última actualización

## 🎯 Casos de Uso

### ✅ Flujo Normal
1. Usuario accede a `/sucursal/pagos`
2. Ve estadísticas rápidas en el header
3. Navega por la lista de facturas
4. Hace clic en "Pagar" para facturas pendientes
5. Es redirigido a MercadoPago

### 🔄 Estados de Carga
- Skeleton loading en estadísticas
- Spinner en widget de facturas
- Estados de procesamiento en botones

### ❌ Estados de Error
- Mensaje claro si no hay branchId
- Reintentos disponibles
- Feedback visual para errores

## 🛠️ Personalización

### Colores de Estado
```css
- Azul: Total de facturas
- Verde: Facturas pagadas  
- Naranja: Facturas pendientes
- Púrpura: Monto total
```

### Breakpoints
```css
- sm: 640px+ (2x2 grid se mantiene)
- md: 768px+ (padding mayor)
- lg: 1024px+ (1x4 grid para stats)
```

## 📱 Optimizaciones Mobile

### Espaciado Reducido
- Padding: `p-2` en mobile vs `p-6` en desktop
- Gaps: `gap-2` en mobile vs `gap-4` en desktop

### Texto Adaptativo
- Headers: `text-xl` en mobile vs `text-3xl` en desktop
- Cards: `text-lg` en mobile vs `text-2xl` en desktop

### Iconos Escalables
- Mobile: `h-4 w-4`
- Desktop: `h-5 w-5`

## 🧪 Testing

### Pruebas Visuales
- [ ] Vista en móvil (320px - 640px)
- [ ] Vista en tablet (641px - 1024px)  
- [ ] Vista en desktop (1025px+)
- [ ] Hover states en desktop
- [ ] Touch interactions en mobile

### Pruebas Funcionales
- [ ] Carga de datos correcta
- [ ] Estadísticas calculadas correctamente
- [ ] Botones de pago funcionando
- [ ] Redirección a MercadoPago
- [ ] Estados de error manejados

### Pruebas de Rendimiento
- [ ] Tiempo de carga inicial
- [ ] Animaciones fluidas
- [ ] Sin re-renders innecesarios

## 🔧 Mantenimiento

### Archivos Relacionados
- `payments_dashboard.view.tsx` - Vista principal
- `payment.widget.tsx` - Widget de facturas
- `list_invoices_by_branch.query.ts` - Query de datos

### Dependencias
- React Query para datos
- Framer Motion para animaciones
- Lucide React para iconos
- Tailwind CSS para estilos

## 💡 Mejoras Futuras

### Funcionalidades
- [ ] Filtros por fecha
- [ ] Ordenamiento de facturas
- [ ] Exportar a PDF
- [ ] Notificaciones push

### Performance
- [ ] Lazy loading de facturas
- [ ] Paginación
- [ ] Cache optimizado
- [ ] Prefetch de datos

### UX/UI
- [ ] Tema oscuro
- [ ] Personalización de colores
- [ ] Más opciones de visualización
- [ ] Accesibilidad mejorada
