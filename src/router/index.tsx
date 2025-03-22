import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'
import CuestionCard from '@/common/molecules/cuestionCard'
import { MapView } from '@/common/widgets/MapView';
import PrivateRoute from './PrivateRouter'
import RoleRoute from './RouleRoute'
import UnauthorizedPage from '@/modules/settings/authorizationPage'
import NotFoundPage from '@/modules/settings/404Page'
import CoffeeloversLayout from '@/modules/coffeelover/components/coffeeloversLayout'
import ButtonLanguages from '@/common/molecules/button-languages'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/common/molecules/button-languages'

const onLanguageChange = (languageCode: string) => {
  const { i18n } = useTranslation();
  console.log(`Language changed to: ${languageCode}`);
  i18n.changeLanguage(languageCode);
};


const AuthRoutes = () => {
  return (

   <>
   <div className='fixed  bottom-4 right-4 z-50'>
    <LanguageSwitcher />
   </div>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/optionRegister" element={<CuestionCard />} />

        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={import.meta.env.VITE_ROLE_COFFEELOVER} />}>
            <Route element={<CoffeeloversLayout />}>
            <Route path="/coffeelover" element={<CoffeeLoverDashboard />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={import.meta.env.VITE_ROLE_STORE} />}>
            <Route path="/coffeelover" element={<CoffeeLoverDashboard />} />
          </Route>

        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
   </>

  )
}


export default AuthRoutes