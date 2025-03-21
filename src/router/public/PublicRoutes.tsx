// src/router/public/PublicRoutes.tsx
import { useRoutes } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'
import CuestionCard from '@/common/molecules/cuestionCard'
import { MapView } from '@/common/widgets/MapView';

export const PublicRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/coffeelover', element: <CoffeeLoverDashboard /> },
    {path: '/map', element: <MapView />},
    { path: '/login', element: <LoginPage /> },
    { path: '/optionRegister', element: <CuestionCard/> },
  ])

  return routes
}