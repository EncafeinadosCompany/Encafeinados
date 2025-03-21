// src/router/public/PublicRoutes.tsx
import { createBrowserRouter, Navigate, useRoutes } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'
import CuestionCard from '@/common/molecules/cuestionCard'
import { MapView } from '@/common/widgets/MapView';
import { ProtectedRoute } from '@/common/molecules/hooks/useProtectedRoute'


  
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />, 
  },
  {
    path: '/map',
    element: <MapView />, 
  },
  {
    path: '/login',
    element: <LoginPage />, 
  },
  {
    path: '/optionRegister',
    element: <CuestionCard />, 
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Ruta protegida (Layout Route)
    children: [
      {
        path: 'coffeelover',
        element: <CoffeeLoverDashboard />, // Ruta protegida
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />, // Ruta de respaldo (404)
  },
]);

export default router