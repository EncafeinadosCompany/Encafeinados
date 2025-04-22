import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROLES } from "@/common/utils/lists/roles";
import PrivateRoute from "./PrivateRouter";
import RoleRoute from "./RouleRoute";

// LAYOUTS
const LoadingSpinner = lazy(() => import("@/common/atoms/LoadingSpinner"));
const HomePage = lazy(() => import("@/modules/home/views/landing/HomePage"));
const AboutPage = lazy(() => import("@/modules/home/views/landing/AboutPage"));

// AUTH
const LoginPage = lazy(() => import("@/modules/home/views/Login/loginPage"));
const CuestionCard = lazy(() => import("@/common/molecules/auth/cuestionCard"));
const GoogleCallback = lazy(() => import("@/common/hooks/google"));
const CompleteProfile = lazy(() => import("@/common/widgets/forms/auth/formCompleteProfile"));
const RegisterCoffeloverPage = lazy(() => import("@/modules/home/views/Login/registerCoffeloverPage"));
const RegisterStorePage = lazy(() => import("@/modules/home/views/Login/registerStoresPage"));
const RegisterStoreBranches = lazy(() => import("@/common/widgets/forms/auth/registerStoreBranches"));
const FinishAdminRegistration = lazy(() => import("@/modules/stores/adminStores/components/FinishAdminRegistration"));

// STORES
const HomeStores = lazy(() => import("@/modules/stores/adminStores/views/homeStores"));
const PrincipalStores = lazy(() => import("@/modules/stores/adminStores/components/principalStorePage"));
const PendingBranchesView = lazy(() => import("@/modules/adminStores/components/PendingBranchesList"));

// ADMIN STORES
const HomeAdminStores = lazy(() => import("@/modules/adminStores/views/homeAdmin"));

// COFFEELOVER
const HomeCoffeelover = lazy(() => import("@/modules/coffeelover/views/homeCoffeelovers"));
const PrincipalCoffeelover= lazy(() => import("@/modules/coffeelover/components/principalCoffeeLover"));
const MapCoffelover = lazy(() => import("@/modules/coffeelover/components/mapCoffelover"));


// MAP
const MapView = lazy(() => import("@/common/widgets/map/MapView"));

// SETTINGS
const NotFound = lazy(() => import("@/modules/settings/404"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorizationPage"));

// LANGUAGES
// const LanguageSwitcher = lazy(() => import("@/common/molecules/settings/button-languages"));

const AuthRoutes = () => {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView view={true} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<CuestionCard />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage />} />
            <Route path="/store-registration" element={<RegisterStorePage />} />
            <Route path="/stores-registration/branches/:storeId" element={<RegisterStoreBranches />} />
            <Route path="/completar-perfil" element={<CompleteProfile/>} />
            <Route index path="/finish-admin-registration" element={<FinishAdminRegistration />} />
            <Route path="/404" element={<NotFound />} />

             {/* PRIVATE ROUTES  */}
            <Route element={<PrivateRoute />}>

              <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                <Route path="/coffeelover" element={<HomeCoffeelover />}>
                  <Route index element={<PrincipalCoffeelover />} />
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
                  <Route index element={< PendingBranchesView />} />
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