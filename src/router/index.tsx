import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRouter";
import RoleRoute from "./RouleRoute";
import { ROLES } from "@/common/utils/lists/roles";
import  LoadingSpinner  from "@/common/atoms/LoadingSpinner";
import NavbarGeneral from "@/common/widgets/nav/nav";
import { CoffeloverItems } from "@/common/utils/lists/nav/CoffeeloverItems";
import { PendingStoresView } from "@/modules/adminStores/components/PendingStoresList";



const CuestionCard = lazy(()=>import("@/common/molecules/auth/cuestionCard"));
const HomePage = lazy(() => import("@/modules/home/views/landing/HomePage"));
const LoginPage = lazy(() => import("@/modules/home/views/Login/loginPage"));
const RegisterCoffeloverPage = lazy(() => import("@/modules/home/views/Login/registerCoffeloverPage"));
const RegisterStorePage = lazy(() => import("@/modules/home/views/Login/registerStoresPage"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorizationPage"));
const NotFound = lazy(() => import("@/modules/settings/404"));

const CoffeeloversLayout = lazy(() => import("@/modules/coffeelover/components/coffeeloversLayout"));
const CoffeeLoverDashboard = lazy(() => import("@/modules/coffeelover/views/CoffeeLoverDashboard"));
const MapCoffelover = lazy(() => import("@/modules/coffeelover/components/mapCoffelover"));
const AboutPage = lazy(() => import("@/modules/home/views/landing/AboutPage"));
const HomeAdminStores = lazy(()=> import ("@/modules/adminStores/views/homeAdmin"));
const MapView = lazy(() => import("@/common/widgets/map/MapView"));

// const LanguageSwitcher = lazy(() => import("@/common/molecules/settings/button-languages"));

const AuthRoutes = () => {
  return (
   <>
   {/* <div className='fixed  bottom-4 right-4 z-50'>
    <LanguageSwitcher />
   </div> */}
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<CuestionCard />} />
            <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage />} />
            <Route path="/store-registration" element={<RegisterStorePage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/mar" element={<NavbarGeneral navItems={CoffeloverItems}/>} />


          <Route path="/admin" element={<HomeAdminStores />} >
            <Route index path="stores/pending" element={<PendingStoresView />} />
          </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                <Route path="/coffeelover" element={<CoffeeloversLayout />}>
                  <Route index element={<CoffeeLoverDashboard />} />
                  <Route path="map-coffelover" element={<MapCoffelover />} />
                </Route>
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                <Route path="/store/dashboard" element={<CoffeeLoverDashboard />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              
              </Route>

            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Suspense>
      </Router>
   </>

  )
}


export default AuthRoutes