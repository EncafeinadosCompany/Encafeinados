// src/router/protected/AdminRoutes.tsx
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'


export const AdminRoutes = [
  {
    path: '/coffeelover',
    element: <CoffeeLoverDashboard />,
  },
]