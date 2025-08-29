# Sistema de Lista de Sucursales - Documentación

## Arquitectura Molecular

Este sistema sigue la arquitectura molecular para crear componentes reutilizables y escalables:

```
Organismo (Widget)
├── Moléculas (Views)
│   ├── BranchCardsView
│   └── BranchTableView
└── Átomos (Controls)
    ├── SearchInput
    ├── ViewToggle
    ├── PaginationControls
    └── BranchCard
```

## Componentes Principales

### 🧩 Átomos (Componentes básicos)

#### SearchInput

- **Ubicación**: `src/common/atoms/search/search_input.atom.tsx`
- **Propósito**: Buscador con botón de limpiar
- **Props**: `value`, `onChange`, `placeholder`, `className`

#### ViewToggle

- **Ubicación**: `src/common/atoms/view/view_toggle.atom.tsx`
- **Propósito**: Alternar entre vista de tarjetas y tabla
- **Props**: `currentView`, `onViewChange`, `className`

#### PaginationControls

- **Ubicación**: `src/common/atoms/pagination/pagination_controls.atom.tsx`
- **Propósito**: Controles de paginación completos
- **Props**: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange`, `onItemsPerPageChange`

#### BranchCard

- **Ubicación**: `src/common/atoms/branch/branch_card.atom.tsx`
- **Propósito**: Tarjeta individual de sucursal
- **Props**: `branch`, `onViewDetails`, `onEdit`, `showActions`

### 🔗 Moléculas (Componentes compuestos)

#### BranchCardsView

- **Ubicación**: `src/common/molecules/branch/branch_cards_view.molecule.tsx`
- **Propósito**: Grid de tarjetas con animaciones
- **Características**:
  - Grid responsivo (1-4 columnas)
  - Animaciones con Framer Motion
  - Estados de carga
  - Mensaje de "sin resultados"

#### BranchTableView

- **Ubicación**: `src/common/molecules/branch/branch_table_view.molecule.tsx`
- **Propósito**: Tabla con ordenamiento
- **Características**:
  - Ordenamiento por columnas
  - Iconos descriptivos
  - Estados de carga
  - Acciones en línea

### 🧬 Organismo (Widget principal)

#### BranchListWidget

- **Ubicación**: `src/common/widgets/branch/branch_list.widget.tsx`
- **Propósito**: Sistema completo de listado
- **Características**:
  - Búsqueda integrada
  - Paginación
  - Alternancia de vistas
  - Completamente reutilizable

## Hook Personalizado

### useBranchList

- **Ubicación**: `src/common/hooks/useBranchList.hook.tsx`
- **Propósito**: Lógica de estado para el listado
- **Funcionalidades**:
  - Filtrado por búsqueda
  - Ordenamiento por múltiples campos
  - Paginación
  - Control de vista

## Casos de Uso

### 1. Lista de Administración (Actual)

```tsx
<BranchListWidget
  branches={branches}
  isLoading={isLoading}
  onViewDetails={handleViewDetails}
  onEdit={handleEdit}
  showActions={true}
  title="Gestión de Sucursales"
  initialPageSize={12}
/>
```

### 2. Lista Pública (Sin edición)

```tsx
<BranchListWidget
  branches={branches}
  isLoading={isLoading}
  onViewDetails={handleViewDetails}
  showActions={false}
  title="Encuentra tu sucursal"
  initialPageSize={16}
/>
```

### 3. Lista Compacta

```tsx
<BranchListWidget
  branches={branches}
  showActions={false}
  title="Sucursales Cercanas"
  initialPageSize={6}
/>
```

## Props del Widget Principal

| Prop                | Tipo               | Requerido | Default                 | Descripción                |
| ------------------- | ------------------ | --------- | ----------------------- | -------------------------- |
| `branches`          | `Branch[]`         | ✅        | -                       | Array de sucursales        |
| `isLoading`         | `boolean`          | ❌        | `false`                 | Estado de carga            |
| `onViewDetails`     | `(branch) => void` | ❌        | -                       | Callback para ver detalles |
| `onEdit`            | `(branch) => void` | ❌        | -                       | Callback para editar       |
| `showActions`       | `boolean`          | ❌        | `true`                  | Mostrar botones de acción  |
| `title`             | `string`           | ❌        | `"Lista de Sucursales"` | Título del widget          |
| `subtitle`          | `string`           | ❌        | -                       | Subtítulo opcional         |
| `initialPageSize`   | `number`           | ❌        | `20`                    | Elementos por página       |
| `searchPlaceholder` | `string`           | ❌        | `"Buscar..."`           | Placeholder del buscador   |

## Funcionalidades

### ✅ Implementadas

- [x] Vista de tarjetas responsiva
- [x] Vista de tabla con ordenamiento
- [x] Búsqueda en tiempo real
- [x] Paginación completa
- [x] Estados de carga
- [x] Animaciones suaves
- [x] Accesibilidad básica
- [x] Componentes reutilizables

### 🚀 Posibles Mejoras Futuras

- [ ] Filtros avanzados (por estado, rating, etc.)
- [ ] Exportación a Excel/PDF
- [ ] Vista de mapa integrada
- [ ] Drag & drop para reordenar
- [ ] Selección múltiple
- [ ] Búsqueda geográfica
- [ ] Favoritos/bookmarks
- [ ] Compartir listas

## Rendimiento

### Optimizaciones Aplicadas

- **Memoización**: Hook useMemo para cálculos pesados
- **Paginación**: Solo renderiza elementos visibles
- **Lazy Loading**: Componentes bajo demanda
- **Debouncing**: En búsqueda (implementar si es necesario)

### Métricas Esperadas

- **Primera carga**: < 100ms para 20 elementos
- **Búsqueda**: < 50ms para filtrado
- **Cambio de página**: < 30ms
- **Cambio de vista**: < 100ms (incluyendo animación)

## Testing

### Pruebas Recomendadas

```tsx
// Pruebas unitarias para cada componente
describe("BranchCard", () => {
  it("should render branch information correctly");
  it("should call onEdit when edit button is clicked");
  it("should show/hide actions based on showActions prop");
});

// Pruebas de integración
describe("BranchListWidget", () => {
  it("should filter branches based on search term");
  it("should paginate correctly");
  it("should sort branches by different fields");
});

// Pruebas de accesibilidad
describe("Accessibility", () => {
  it("should have proper ARIA labels");
  it("should be keyboard navigable");
  it("should have sufficient color contrast");
});
```

## Mantenimiento

### Estructura de Archivos

```
src/common/
├── atoms/
│   ├── search/search_input.atom.tsx
│   ├── view/view_toggle.atom.tsx
│   ├── pagination/pagination_controls.atom.tsx
│   └── branch/branch_card.atom.tsx
├── molecules/
│   └── branch/
│       ├── branch_cards_view.molecule.tsx
│       └── branch_table_view.molecule.tsx
├── widgets/
│   └── branch/
│       ├── branch_list.widget.tsx
│       └── branch_list_examples.tsx
└── hooks/
    └── useBranchList.hook.tsx
```

### Versionado

- **v1.0.0**: Implementación inicial
- **v1.1.0**: Mejoras de rendimiento planeadas
- **v1.2.0**: Filtros avanzados planeados
