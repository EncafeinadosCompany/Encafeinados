import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// ROUTES
import { ROLES } from "@/common/utils/lists/roles.utils";
import PrivateRoute from "@/router/private-route";
import RoleRoute from "@/router/role-route";
import RouteLoadingIndicator from "./route_loading_indicador.router";
import Dashboard_Branch from "@/modules/admin_branches/views/manage_dashboard.view";
const PruebaDashboard = lazy(() => import("@/modules/admin/components/manage_dasboard.view"))

// LAYOUTS
const HomePage = lazy(() => import("@/modules/home/views/landing/home_page"));
const AboutPage = lazy(() => import("@/modules/home/views/landing/about_page"));

// AUTH
const LoginPage = lazy(() => import("@/modules/home/views/Login/login_page"));
const PasswordResetPage = lazy(() => import("@/modules/auth/views/password_reset.view"));
const CuestionCard = lazy(() => import("@/common/molecules/auth/login/cuestion_card.molecule"));
const GoogleCallback = lazy(() => import("@/common/hooks/auth/use_google.hook"));
const CompleteProfile = lazy(() => import("@/common/widgets/forms/auth/form_complete_profile.widget"));
const RegisterCoffeloverPage = lazy(() => import("@/modules/home/views/Login/register_coffelover_page"));
const RegisterStorePage = lazy(() => import("@/modules/home/views/Login/register_stores_page"));
const RegisterStoreBranches = lazy(() => import("@/common/widgets/forms/auth/form_register_stores_branches.widget"));
const FinishAdminRegistration = lazy(() => import("@/modules/admin/views/finish_admin_registration_page"));


//ADMIN
const Menubar_admin = lazy(() => import("@/modules/admin/views/menubar_admin_nav"));
const Album_Management = lazy(() => import("@/modules/admin/components/album/album_manager.component"));
const Event_Management = lazy(() => import("@/common/widgets/admin/events/event.widget"));
const Branch_Management = lazy(() => import("@/modules/admin/components/branches/pending_branches_list.component"));
const Register_events = lazy(() => import("@/common/widgets/forms/events/form_events.widget"));


// STORES
const Menubar_store = lazy(() => import("@/modules/admin_stores/views/menubar_store"));
const BranchManagement = lazy(() => import("@/common/widgets/admin_stores/branches/branch_management.widget"));
const StoreDetailsCard = lazy(() => import("@/common/molecules/coffeelover/stores/details_stores_dialog.molecule"));

// ADMIN STORES
const ImagesGallery = lazy(() => import("@/common/widgets/admin_branches/images.widget"));
const Form_edit_branch = lazy(() => import("@/common/widgets/forms/branch/form_edit_branches_widget"));

//BRANCHES
const Menubar_branch = lazy(() => import("@/modules/admin_branches/views/menubar_branch"));
const DetailsBranches = lazy(() => import("@/common/widgets/admin_branches/details_branches.widget"));
const AttributesDashboard = lazy(() => import("@/common/widgets/admin_branches/attributes.widget"));
const BranchReviewsView = lazy(() => import("@/modules/admin_branches/views/branch_reviews.view"));

// COFFEELOVER
const Menubar_Coffelover = lazy(() => import("@/modules/coffeelover/views/menubar_coffelover"));
const PrincipalCoffeelover = lazy(() => import("@/modules/coffeelover/views/principal_coffeelover.view"));
const RegisterStoreVisit = lazy(() => import("@/modules/coffeelover/components/stores/register_store_visit.component"));
const ReviewView = lazy(() => import('@/modules/coffeelover/components/review/review.view'));
const ProfileView = lazy(() => import('@/modules/coffeelover/components/profile/profile.view'));
const Prueba_album = lazy(() => import("@/common/widgets/prueba_album"));

// ALBUMS COFFELOVER
const ListAlbum = lazy(() => import("@/common/widgets/coffeelover/album/list_album_coffeelover.widget"));
const PageAlbum = lazy(() => import("@/common/widgets/coffeelover/album/page_album.widget"));

// MAP
const MapView = lazy(() => import("@/common/widgets/map/map_view.widget"));

// SETTINGS
const NotFound = lazy(() => import("@/modules/settings/404"));
const UnauthorizedPage = lazy(() => import("@/modules/settings/authorization_page"));


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

            <Route path="/prueba" element={<Prueba_album />} />

            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView view={true} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
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

                <Route path="/coffeelover" element={<Menubar_Coffelover />}>
                  <Route index element={<PrincipalCoffeelover />} />
                  <Route path="album" element={<ListAlbum />} />
                  <Route path="review" element={<ReviewView />} />
                  <Route path="Profile" element={<ProfileView />} />
                  <Route path="map-coffelover" element={<MapView />} />
                  <Route path="details" element={<StoreDetailsCard />} />
                  <Route path="pruebas-album" element={<Prueba_album />} />
                  <Route path="register-branch-visit/" element={<RegisterStoreVisit />} />
                </Route>
                <Route path="/open-album" element={<PageAlbum />} />

              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                <Route path="/stores" element={<Menubar_store />}>
                  <Route index element={<BranchManagement />} />
                </Route>
              </Route>


              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN_SUCURSAL, ROLES.STORE]} />}>
                <Route path="/sucursal" element={<Menubar_branch />}>
                  <Route index element={<DetailsBranches />} />
                  <Route path="valoraciones" element={<BranchReviewsView />} />
                  <Route path="images" element={<ImagesGallery />} />
                  <Route path="perfil" element={<Form_edit_branch />} />
                  <Route path="attributes" element={<AttributesDashboard />} />
                  <Route path="dashboard" element={<Dashboard_Branch/>} />
                </Route>
              </Route>

              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/admin" element={<Menubar_admin />}>
                  <Route index element={<Branch_Management />} />
                  <Route path="dashboard" element={< PruebaDashboard />} />
                  <Route path="albums" element={<Album_Management />} />
                  <Route path="event" element={<Event_Management />} />
                  <Route path="form-event" element={<Register_events />} />
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