// src/router/public/PublicRoutes.tsx
import {  Route, Routes} from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'
import CuestionCard from '@/common/molecules/cuestionCard'
import { MapView } from '@/common/widgets/MapView';


export function AuthRoutes() {
  return (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/map" element={<MapView />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/optionRegister" element={<CuestionCard />} />
    <Route path="/coffeelover" element={<CoffeeLoverDashboard />} />
  </Routes>

  )
}