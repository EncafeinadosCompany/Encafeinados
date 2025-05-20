import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROLES } from "@/common/utils/lists/roles.utils";
import PrivateRoute from "./PrivateRouter";
import RoleRoute from "./RouleRoute";

import { RouteLoadingIndicator } from "./route_loading_indicador.router";

import Perfil_branches from "@/modules/admin_branches/views/perfil_branches.page";

// LAYOUTS
const HomePage = lazy(() => import("@/modules/home/views/landing/home_page"));
const AboutPage = lazy(() => import("@/modules/home/views/landing/about_page"));

// AUTH
const LoginPage = lazy(() => import("@/modules/home/views/Login/login_page"));
const CuestionCard = lazy(() => import("@/common/molecules/auth/login/cuestion_card.molecule"));
const GoogleCallback = lazy(() => import("@/common/hooks/google"));
const CompleteProfile = lazy(() => import("@/common/widgets/forms/auth/form_complete_profile.widget"));
const RegisterCoffeloverPage = lazy(() => import("@/modules/home/views/Login/register_coffelover_page"));
const RegisterStorePage = lazy(() => import("@/modules/home/views/Login/register_stores_page"));
const RegisterStoreBranches = lazy(() => import("@/common/widgets/forms/auth/form_register_stores_branches.widget"));
const FinishAdminRegistration = lazy(() => import("@/modules/admin/views/finish_admin_registration_page"));

// STORES
const HomeStores = lazy(() => import("@/modules/admin_stores/views/home_stores_nav"));
const BranchManagement = lazy(() => import("@/common/widgets/admin_stores/branches/branch_management.widget"));

// ADMIN STORES
const HomeAdminStores = lazy(() => import("@/modules/admin/views/home_admin_stores_nav"));
const PendingBranchesView = lazy(() => import("@/modules/admin/components/branches/pending_branches_list.component"));
const AlbumManager = lazy(() => import("@/modules/admin/components/album/album_manager.component"));
const ImagesGallery = lazy(() => import("@/common/widgets/admin_branches/edit_images.widget"));
const FormEditBranch = lazy(() => import("@/common/widgets/forms/auth/form_edit_branches_widget"));
//BRANCHES
const HomeBranchesNav = lazy(() => import("@/modules/admin_branches/views/home_branches_nav"));
const PrincipalBranchesPage = lazy(() => import("@/modules/admin_branches/views/principal_branches_page"));
const AttributesDashboard = lazy(() => import("@/common/widgets/admin_branches/create_attributes.widgets"));

// COFFEELOVER
const HomeCoffeelover = lazy(() => import("@/modules/coffeelover/views/home_coffeelover_page"));
const PrincipalCoffeelover = lazy(() => import("@/modules/coffeelover/views/principal_coffeelover_nav"));
const RegisterStoreVisit = lazy(() => import("@/modules/coffeelover/components/stores/register_store_visit.component"));
const ReviewView = lazy(() => import('@/modules/coffeelover/components/review/review.view'));
const ProfileView = lazy(() => import('@/modules/coffeelover/components/profile/profile.view'));


// MAP
const MapView = lazy(() => import("@/common/widgets/map/map_view.widget"));

// SETTINGS
const NotFound = lazy(() => import("@/modules/settings/404"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorization_page"));


// ALBUMS
const ListAlbum = lazy(() => import("@/common/widgets/coffeelover/album/list_album_coffeelover.widget"));
const PageAlbum = lazy(() => import("@/common/widgets/coffeelover/album/page_album.widget"));




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

            {/* PRUEBAS */}
            {/* <Route path="/prueba" element={<CanvasDashboard />} /> */}


            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView view={true} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CuestionCard />} />
            <Route path="/google/callback" element={<GoogleCallback />} />
            <Route path="/coffee-lover-registration" element={<RegisterCoffeloverPage />} />
            <Route path="/store-registration" element={<RegisterStorePage />} />
            <Route path="/stores-registration/branches/:storeId" element={<RegisterStoreBranches />} />
            <Route path="/completar-perfil" element={<CompleteProfile />} />
            <Route index path="/finish-admin-registration" element={<FinishAdminRegistration />} />
            <Route path="/404" element={<NotFound />} />



            {/* PRIVATE ROUTES  */}
            <Route element={<PrivateRoute />}>

              <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                <Route path="/coffeelover" element={<HomeCoffeelover />}>
                  <Route index element={<PrincipalCoffeelover />} />
                  <Route path="map-coffelover" element={<MapView />} />
                  <Route path="register-branch-visit/" element={<RegisterStoreVisit />} />
                  <Route path="album" element={<ListAlbum />} />
                  <Route path="review" element={<ReviewView />} />
                  <Route path="Profile" element={<ProfileView />} />

                </Route>
                <Route path="/open-album" element={<PageAlbum />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                <Route path="/stores" element={<HomeStores />}>
                  <Route index element={<BranchManagement />} />
                </Route>
              </Route>


              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN_SUCURSAL]} />}>
                <Route path="/sucursal" element={<HomeBranchesNav />}>
                  <Route index element={<PrincipalBranchesPage />} />
                  <Route path="images" element={<ImagesGallery />} />
                  <Route path="perfil" element={<FormEditBranch />} />
                  <Route path="attributes" element={<AttributesDashboard />} />
                  <Route path="perfil_prueba" element={<Perfil_branches />}>
                  </Route>
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