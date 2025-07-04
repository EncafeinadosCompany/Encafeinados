# Documentación del Sistema de Búsqueda y Filtrado Unificado

## Resumen

Se ha unificado el sistema de búsqueda y filtrado de cafeterías en el mapa y la vista principal de coffeelover para usar el endpoint `/branches/search` de la API, mejorando la UX y corrigiendo problemas de sincronización.

## Arquitectura de la Solución

### 1. Hook Principal: `useBranchSearch`

**Ubicación**: `src/common/hooks/map/useBranchSearch.ts`

**Responsabilidades**:
- Manejo de estado de búsqueda y filtros
- Debounce automático para búsquedas (500ms)
- Integración con la API `/branches/search`
- Mapeo de datos de la API al formato interno

**Estado manejado**:
```typescript
interface FilterOptions {
  minRating: number;
  isOpen: boolean;
  sortBy: 'distance' | 'rating';
  attributes: number[];
}
```

### 2. Lógica de Datos: `useMapData`

**Ubicación**: `src/common/hooks/map/useMapData.ts`

**Función principal**: Transformar datos de branches de la API al formato `Cafe[]` usado por la UI.

**Características**:
- Filtrado de branches aprobadas únicamente
- Cálculo automático de distancias cuando hay ubicación del usuario
- Manejo de fallbacks para datos faltantes

### 3. Componente Principal: `MapView`

**Ubicación**: `src/common/widgets/map/map_view.widget.tsx`

#### Flujo de Datos

```
Datos Base (cafes) ← useMapData ← useBranches (sin filtros)
                     ↓
Datos Filtrados (apiCafes) ← useBranchSearch ← useSearchBranches (con filtros)
                     ↓
Datos Finales (sortedCafes) ← Lógica condicional
```

#### Lógica de `sortedCafes`

```typescript
const sortedCafes = useMemo(() => {
  // Si hay filtros activos, usar datos de la API
  if (apiHasActiveFilters) {
    return apiCafes;
  }
  // Sin filtros: usar datos locales completos
  return cafes;
}, [apiCafes, cafes, apiHasActiveFilters]);
```

## Flujos Principales

### 1. Navegación por URL (cafeId)

**Trigger**: URL con parámetro `?cafeId=123`

**Flujo**:
1. Verificar que el mapa esté cargado y haya datos
2. Buscar la cafetería en datos completos (`cafes`)
3. Si hay filtros activos y la cafetería no está visible:
   - Limpiar filtros automáticamente
   - Mostrar toast informativo
4. Navegar hacia la cafetería con animación
5. Evitar bucles verificando el estado actual

### 2. Búsqueda y Filtrado

**Trigger**: Usuario escribe en campo de búsqueda o modifica filtros

**Flujo**:
1. Hook `useBranchSearch` maneja el debounce automáticamente
2. Se construyen parámetros para la API
3. La API retorna resultados filtrados
4. `sortedCafes` cambia automáticamente a usar datos filtrados
5. UI se actualiza mostrando solo resultados relevantes

### 3. Limpieza de Filtros

**Opciones disponibles**:
- **Botón "X" en indicador de filtros**: Limpia todo
- **Botón "Restablecer" en modal**: Solo restablece estado temporal
- **Limpieza automática por navegación**: Cuando se navega a cafetería no visible

### 4. Cierre de Modal de Detalles

**Flujo**:
1. `setActiveCafe(null)` limpia el estado
2. Se remueve `cafeId` de la URL para evitar reapertura
3. Opcionalmente se resetea el zoom del mapa

## Componentes Reutilizables

### FilterModal

**Características**:
- Estado temporal para filtros (no aplica hasta presionar "Aplicar")
- Botón "Restablecer" solo afecta estado temporal
- Rules of Hooks cumplidas correctamente

### GoToButton

**Uso**: `<GoToButton text="cafetería" branchId={123} mapRoute="public" />`

**Función**: Navega hacia la vista de mapa con la cafetería específica mediante URL.

## Prevención de Problemas

### 1. Bucles Infinitos

**Problema**: useEffect que se dispara constantemente
**Solución**: 
- Verificación de estado actual antes de actuar
- Dependencias específicas y estables
- Sin cleanup functions innecesarias

### 2. Datos Inconsistentes

**Problema**: Funciones buscan en arrays incorrectos
**Solución**: 
- Todas las funciones de navegación usan `sortedCafes`
- `sortedCafes` siempre contiene los datos correctos según el contexto

### 3. Race Conditions

**Problema**: Filtros y navegación interfieren entre sí
**Solución**:
- Timeouts para esperar actualización de estado
- Verificaciones de estado antes de actuar
- Limpieza controlada de parámetros de URL

## Consideraciones de Performance

1. **Debounce en búsqueda**: 500ms para evitar demasiadas requests
2. **useMemo en datos calculados**: `sortedCafes`, `cafePositions`, etc.
3. **useCallback en funciones**: Previene re-renders innecesarios
4. **Queries optimizadas**: Solo se ejecutan cuando hay parámetros válidos

## Testing y Validación

### Escenarios de Prueba Críticos

1. **Navegación directa por URL**:
   - Con y sin filtros activos
   - Cafetería existente vs no existente
   - Múltiples navegaciones consecutivas

2. **Filtrado y búsqueda**:
   - Cambios rápidos de filtros
   - Búsquedas con resultados vacíos
   - Combinación de filtros múltiples

3. **Estados de carga**:
   - Carga inicial del mapa
   - Búsquedas en progreso
   - Errores de red

4. **Responsividad**:
   - Desktop vs mobile
   - Cambios de orientación
   - Diferentes tamaños de pantalla

## Logs y Debugging

Durante desarrollo, mantener logs en:
- Cambios de `sortedCafes`
- Navegación por `cafeId`
- Aplicación/limpieza de filtros
- Errores de API

**Nota**: Remover logs antes de producción.

## Próximas Mejoras

1. **Cache inteligente**: Evitar re-fetch de datos similares
2. **Infinite scroll**: Para resultados muy grandes
3. **Filtros geográficos**: Por área/radio de búsqueda
4. **Historial de búsquedas**: Guardar búsquedas recientes
5. **Performance metrics**: Monitoreo de tiempos de respuesta
