import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROLES } from "@/common/utils/lists/roles";

import PrivateRoute from "./PrivateRouter";
import RoleRoute from "./RouleRoute";
const CompletePerfil = lazy( ()=> import("@/common/widgets/forms/auth/formCompleteProfile"));
const PrincipalStores = lazy(() => import("@/modules/stores/components/principalStorePage"));
const RegisterStoreBranches = lazy (()=> import("@/common/widgets/forms/auth/registerStoreBranches"));
const LoadingSpinner = lazy(() => import ("@/common/atoms/LoadingSpinner"));
const HomePage = lazy(() => import("@/modules/home/views/landing/HomePage"));
const AboutPage = lazy(() => import("@/modules/home/views/landing/AboutPage"));

const LoginPage = lazy(() => import("@/modules/home/views/Login/loginPage"));
const CuestionCard = lazy(() => import("@/common/molecules/auth/cuestionCard"));
const FinishAdminRegistration = lazy(() => import("@/modules/stores/components/FinishAdminRegistration"));
const GoogleCallback = lazy(() => import("@/common/hooks/google"));
const RegisterCoffeloverPage = lazy(() => import("@/modules/home/views/Login/registerCoffeloverPage"));
const RegisterStorePage = lazy(() => import("@/modules/home/views/Login/registerStoresPage"));

const HomeStores = lazy(() => import ("@/modules/stores/views/homeStores"));
const PendingStoresView = lazy(() => import("@/modules/adminStores/components/PendingStoresList"));
const PendingBranchesView = lazy(() => import("@/modules/adminStores/components/PendingBranchesList"));

const HomeAdminStores = lazy(() => import("@/modules/adminStores/views/homeAdmin"));

const HomeCoffeelover = lazy(() => import("@/modules/coffeelover/components/homeCoffeelover"));
const CoffeeLoverDashboard = lazy(() => import("@/modules/coffeelover/views/CoffeeLoverDashboard"));
const MapCoffelover = lazy(() => import("@/modules/coffeelover/components/mapCoffelover"));

const MapView = lazy(() => import("@/common/widgets/map/MapView"));

const NotFound = lazy(() => import("@/modules/settings/404"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorizationPage"));
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
            <Route path="/map" element={<MapView view={true} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<CuestionCard />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage />} />
            <Route path="/store-registration" element={<RegisterStorePage />} />
            <Route path="/stores-registration/branches/:storeId" element={<RegisterStoreBranches/>} />
            <Route path="/completar-perfil" element={<CompletePerfil />} />
            <Route index path="/finish-admin-registration" element={<FinishAdminRegistration />} />
            <Route path="/404" element={<NotFound />} />


            <Route element={<PrivateRoute/>}>

              <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                <Route path="/coffeelover" element={<HomeCoffeelover />}>
                  <Route index element={<CoffeeLoverDashboard />} />
                  <Route path="map-coffelover" element={<MapCoffelover />} />
                </Route>
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                <Route path="/stores" element={<HomeStores />}> 
                <Route index element={<PrincipalStores />} />
                </Route>
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin" element={<HomeAdminStores />} >
                <Route index element={<PendingStoresView />} />
                <Route path="branches" element={< PendingBranchesView/>} /> 
               </Route>
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