import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { CoffeeLoverDashboard } from '@/modules/coffeelover/views/CoffeeLoverDashboard'
import { HomePage } from '@/modules/home/views/landing/HomePage'
import { LoginPage } from '@/modules/home/views/Login/loginPage'
import CuestionCard from '@/common/molecules/auth/cuestionCard'
import { MapView } from '@/common/widgets/map/MapView';
import PrivateRoute from './PrivateRouter'
import RoleRoute from './RouleRoute'
import UnauthorizedPage from '@/modules/settings/authorizationPage'
import NotFound from '@/modules/settings/404'
import CoffeeloversLayout from '@/modules/coffeelover/components/coffeeloversLayout'
import LanguageSwitcher from '@/common/molecules/settings/button-languages'
import RegisterCoffeloverPage from '@/modules/home/views/Login/registerCoffeloverPage'
import RegisterStorePage from '@/modules/home/views/Login/registerStoresPage'




const AuthRoutes = () => {
  return (

   <>
   {/* <div className='fixed  bottom-4 right-4 z-50'>
    <LanguageSwitcher />
   </div> */}
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<CuestionCard/>}/>
        <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage/>} />
        <Route path= "/store-registration" element= {<RegisterStorePage/>}/>
        <Route path="/404" element={<NotFound />} />


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