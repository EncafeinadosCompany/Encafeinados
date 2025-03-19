// src/router/public/PublicRoutes.tsx
import { useRoutes } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'

export const PublicRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/coffeelover', element: <CoffeeLoverDashboard /> },
    { path: '/login', element: <LoginPage /> },
  ])

  return routes
}