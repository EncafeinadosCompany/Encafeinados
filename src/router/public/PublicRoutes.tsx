// src/router/public/PublicRoutes.tsx
import { useRoutes } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/HomePage'

export const PublicRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/coffeelover', element: <CoffeeLoverDashboard /> },
  ])

  return routes
}