# Guía para la visualización segura de datos numéricos

## Problema

En nuestra aplicación de café, hemos detectado que algunos valores numéricos se muestran como "0" en dispositivos móviles mientras funcionan correctamente en PC. Esto ocurre debido a que:

1. Los dispositivos móviles tienen un rendimiento diferente y pueden renderizar componentes en momentos distintos.
2. Cuando se inicializa un estado con `0` o `null` y luego se actualiza, puede haber un parpadeo donde se muestra el valor inicial brevemente.
3. Las diferencias en tiempos de carga entre dispositivos pueden resultar en visualizaciones inconsistentes.

## Solución

Hemos implementado un sistema integral para manejar valores numéricos de forma segura, especialmente en dispositivos móviles:

### 1. Contexto Global (AppDataContext)

Proporciona información sobre el tipo de dispositivo y el estado de carga de datos:

```tsx
import { useAppData } from '@/common/context/AppDataContext';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, deviceType } = useAppData();
  
  return (
    <div>
      {isMobile ? "Versión móvil" : "Versión de escritorio"}
    </div>
  );
};
```

### 2. Hook personalizado (useSafeNumericValue)

Maneja el estado de los valores numéricos considerando el tipo de dispositivo:

```tsx
import { useSafeNumericValue } from '@/common/hooks/useSafeNumericValue';

const MyComponent = ({ count }) => {
  const { safeValue, isReady } = useSafeNumericValue(count, null, 150);
  
  return (
    <div>
      {isReady ? safeValue : "Cargando..."}
    </div>
  );
};
```

### 3. Componente reutilizable (SafeNumericDisplay)

Proporciona una interfaz simplificada para mostrar valores numéricos:

```tsx
import SafeNumericDisplay from '@/common/atoms/SafeNumericDisplay';

const MyComponent = ({ price, rating, quantity }) => {
  return (
    <div>
      <p>Precio: <SafeNumericDisplay value={price} prefix="$" format={(val) => val.toFixed(2)} /></p>
      <p>Calificación: <SafeNumericDisplay value={rating} suffix="/5" /></p>
      <p>Cantidad: <SafeNumericDisplay value={quantity} defaultValue="..." /></p>
    </div>
  );
};
```

### 4. Utilidades para valores numéricos (numeric_value.utils.ts)

Funciones de utilidad para manejar y formatear valores numéricos:

```tsx
import { safeNumber, formatNumberWithDecimals, formatPrice } from '@/common/utils/numeric_value.utils';

// Garantizar que un valor no sea undefined/null/NaN
const count = safeNumber(product.count, 0);

// Formatear un número con decimales específicos
const rating = formatNumberWithDecimals(product.rating, 1, 'N/A');

// Formatear un precio con configuración regional
const price = formatPrice(product.price, 'es-CO', 'COP', 'Precio no disponible');
```

## Componentes actualizados

Los siguientes componentes han sido actualizados para usar visualización segura de valores numéricos:

1. **Componentes relacionados con cafeterías**:
   - `map_sidebar.molecule.tsx` - Contador de cafeterías y filtros
   - `cafe_card.molecule.tsx` - Calificaciones y distancias
   - `cafe_detail.molecule.tsx` - Calificaciones y detalles
   - `StarsRating` - Calificación con estrellas
   - `ReviewStars` - Calificación con estrellas en reseñas
   - `smart_custer_group.molecule.tsx` - Contador de cafeterías en clusters

2. **Componentes de perfil de usuario**:
   - `user_reviews.molecule.tsx` - Calificaciones de reseñas
   - `favorite_cafes.molecule.tsx` - Calificaciones de cafeterías favoritas
   
3. **Componentes informativos**:
   - `cafe_info_card.molecule.tsx` - Información de cafeterías con calificación
   - `LoadingSpinner.tsx` - Porcentaje de carga

4. **Utilidades**:
   - `getRatingText` - Conversión de calificación numérica a texto
   - `sortCafes` - Ordenamiento seguro con valores numéricos

## Recomendaciones de uso

1. **Valores que pueden ser 0:** Usar `SafeNumericDisplay` para garantizar que no se muestra un "0" transitorio durante la carga.

2. **Datos de API:** Siempre usar alguna de estas herramientas para los valores numéricos que vienen de API.

3. **Estadísticas y contadores:** Especialmente importante en componentes que muestran valores como:
   - Número de resultados
   - Calificaciones
   - Precios
   - Totales
   - Porcentajes de progreso

4. **Para valores que no deberían ser 0:** Establecer un `defaultValue` apropiado como "..." o "-".

5. **Formateo de precios y valores específicos:** Utilizar las funciones de utilidad para formateo consistente.

## Patrones comunes y soluciones

| Problema | Solución recomendada |
|----------|----------------------|
| Valores de estadísticas (ratings, contadores) | `SafeNumericDisplay` |
| Precios y valores monetarios | `formatPrice` y `SafeNumericDisplay` |
| Porcentajes y barras de progreso | `useSafeNumericValue` |
| Totales y subtotales | `SafeNumericDisplay` con `defaultValue` |
| Validación de input numérico | `isValidNumber` antes de procesar |
| Ordenamiento de listas | Usar `sortCafes` con manejo seguro de valores |
| Visualización de estrellas | Utilizar `StarsRating` o `ReviewStars` |

## Ejemplo completo

Puede encontrar un ejemplo completo de implementación en:
`src/common/molecules/examples/safe_numeric_examples.molecule.tsx`
