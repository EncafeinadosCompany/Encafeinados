import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { ROLES } from "@/common/utils/lists/roles";
import PrivateRoute from "./PrivateRouter";
import RoleRoute from "./RouleRoute";
import GoogleWithRegister from "@/common/hooks/registerWithGoogle";
import LoadingSpinner from "@/common/atoms/LoadingSpinner";

import ListAlbum from "@/common/widgets/coffeelovers/album/listAlbumWidget";
import { PageAlbum } from "@/common/widgets/coffeelovers/album/pageAlbum";

// LAYOUTS
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
const BranchManagement = lazy(() => import("@/common/widgets/adminStores/branchManagement"));

// ADMIN STORES
const HomeAdminStores = lazy(() => import("@/modules/adminStores/views/homeAdmin"));
const PendingBranchesView = lazy(() => import("@/modules/adminStores/components/PendingBranchesList"));
const AlbumManager = lazy(() => import("@/modules/adminStores/components/AlbumManager"));

// COFFEELOVER
const HomeCoffeelover = lazy(() => import("@/modules/coffeelover/views/homeCoffeelovers"));
const PrincipalCoffeelover = lazy(() => import("@/modules/coffeelover/components/principalCoffeeLover"));
const RegisterStoreVisit = lazy(() => import("@/modules/coffeelover/components/registerStoreVisit"));

// MAP
const MapView = lazy(() => import("@/common/widgets/map/MapView"));

// SETTINGS
const NotFound = lazy(() => import("@/modules/settings/404"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorizationPage"));

const RouteLoadingIndicator = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setProgress(0);
    
    const expectedLoadTime = 2500; 
    const startTime = Date.now();
    
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(99, (elapsed / expectedLoadTime) * 100);
      
      setProgress(Math.round(calculatedProgress));
      
      if (calculatedProgress >= 99) {
        clearInterval(intervalId);
      }
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [location.pathname]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(100);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return <LoadingSpinner progress={progress} message="Preparando tu café..." size="lg" />;
};

const AuthRoutes = () => {
  return (
    <>
      <Router>
        <Suspense fallback={
          <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-50">
            <RouteLoadingIndicator />
          </div>
        }>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView view={true} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CuestionCard />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/registerWithGoogle" element={<GoogleWithRegister />}/>
            <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage />}/>
            <Route path="/store-registration" element={<RegisterStorePage />} />
            <Route path="/stores-registration/branches/:storeId" element={<RegisterStoreBranches />}/>
            <Route path="/completar-perfil" element={<CompleteProfile />} />
            <Route index path="/finish-admin-registration" element={<FinishAdminRegistration />}/>
            <Route path="/404" element={<NotFound />} />
           

            {/* PRIVATE ROUTES  */}
            <Route element={<PrivateRoute />}>
              <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                <Route path="/coffeelover" element={<HomeCoffeelover />}>
                  <Route index element={<PrincipalCoffeelover />} />
                  <Route path="map-coffelover" element={<MapView />} />
                  <Route path="register-branch-visit/" element={<RegisterStoreVisit />}/>
                  <Route path="album" element={<ListAlbum />} />
                </Route>
              <Route path="/open-album" element={<PageAlbum />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                <Route path="/stores" element={<HomeStores />}>
                  <Route index element={<BranchManagement />} />
                </Route>
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/admin" element={<HomeAdminStores />}>
                  <Route index element={<PendingBranchesView />} />
                  <Route path="albums" element={<AlbumManager />}></Route>
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default AuthRoutes;