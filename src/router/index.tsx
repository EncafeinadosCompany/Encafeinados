import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

  // ROUTES CONFIG
  import { ROLES } from "@/common/utils/lists/roles.utils";
  import PrivateRoute from "@/router/private-route";
  import RoleRoute from "@/router/role-route";
  import RouteLoadingIndicator from "./route_loading_indicador.router";
  import { ErrorBoundary } from "@/common/utils/error_boundary";
  
  //LAYOUTS
  const Layout_register = lazy(()=> import("@/modules/layouts/layout_register"));
  const Layout_admin = lazy(() => import("@/modules/layouts/layout_admin"));
  const Layout_coffelover = lazy(() => import("@/modules/layouts/layout_coffelover"));
  const Layout_store = lazy(() => import("@/modules/layouts/layout_store"));
  const Layout_branch = lazy(() => import("@/modules/layouts/layout_branch"));
  
  // AUTH
  const Login = lazy(() => import("@/modules/home/views/Login/login_page"));
  const Password_reset = lazy(() => import("@/modules/auth/views/password_reset.view"));
  const Cuestion_card = lazy(() => import("@/modules/auth/views/cuestions_card.view"));
  const Google_callback = lazy(() => import("@/common/hooks/auth/use_google.hook"));
  
  const Register_coffeelover = lazy(()=> import("@/common/widgets/forms/auth/form_register_coffelovers.widget"));
  const Register_store = lazy(() => import("@/common/widgets/forms/auth/form_register_stores.widget"));
  const Register_branch = lazy(() => import("@/common/widgets/forms/auth/form_register_branches.widget"));
  const Register_admin = lazy(() => import("@/modules/admin/views/register_admin.view"));
  const Register_criteria = lazy (()=> import("@/modules/auth/views/registerCriteria.views"))
  
  //ADMIN
  const Dashboard_admin = lazy(() => import("@/modules/admin/components/manage_dasboard.view"));
  const Album_management = lazy(() => import("@/modules/admin/components/album/album_manager.component"));
  const Event_management = lazy(() => import("@/common/widgets/admin/events/event.widget"));
  const Branch_Management = lazy(() => import("@/modules/admin/components/branches/pending_branches_list.component"));
  const Register_events = lazy(() => import("@/common/widgets/forms/events/form_events.widget"));
  

  // ADMIN STORES
  const Branch_management_AdminStore = lazy(()=> import ("@/modules/admin_stores/views/branch/branch_management.view"));
  const Images_gallery = lazy(() => import("@/common/widgets/admin_branches/images.widget"));
  const Form_edit_branch = lazy(() => import("@/common/widgets/forms/branch/form_edit_branches_widget"));
  
  //ADMIN BRANCHES
  const Dashboard_branch = lazy(() => import ("@/modules/admin_branches/views/manage_dashboard.view"));
  const Details_branch = lazy(() => import("@/common/widgets/admin_branches/details_branches.widget"));
  const Payment_result = lazy(() => import("@/modules/admin_branches/views/payment_result.view"));
  const Attributes_management= lazy(() => import("@/common/widgets/admin_branches/attributes.widget"));
  const Reviews_management = lazy(() => import("@/modules/admin_branches/views/branch_reviews.view"));
  const Payments_management= lazy(() => import("@/modules/admin_branches/views/payments_dashboard.view"));
  
  // COFFEELOVER
  const Principal_coffeelover = lazy(() => import("@/modules/coffeelover/views/principal_coffeelover.view"));
  const Profile_coffeelover = lazy(() => import("@/modules/coffeelover/views/profile/profile.view"));
  const Register_visitStore = lazy(() => import("@/modules/coffeelover/views/stores/register_store_visit.view"));
  const Details_store = lazy( () => import("@/common/molecules/coffeelover/stores/details_stores_dialog.molecule"));
  const Reviews = lazy(() => import("@/modules/coffeelover/views/review/review.view"));
  const Album = lazy(() => import("@/common/widgets/prueba_album"));

  // ALBUMS COFFELOVER
  const List_Album = lazy(() =>import("@/common/widgets/coffeelover/album/list_album_coffeelover.widget"));
  const Page_Album = lazy(() => import("@/common/widgets/coffeelover/album/page_album.widget"));

  // MAP
  const Map= lazy(() => import("@/common/widgets/map/map_view.widget"));

  // SETTINGS
  const NotFound = lazy(() => import("@/modules/settings/404"));
  const UnauthorizedPage = lazy(() => import("@/modules/settings/authorization_page"));

  // LANDING PAGES
  const HomePage = lazy(() => import("@/modules/home/views/landing/home_page"));
  const AboutPage = lazy(() => import("@/modules/home/views/landing/about_page"));

const AuthRoutes = () => {
  return (
    <>
      <ErrorBoundary>
        <Router>
          <Suspense
            fallback={
              <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-50">
                <RouteLoadingIndicator />
              </div>
            }>
              
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/map" element={<Map view={true} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/reset-password" element={<Password_reset/>} />
              <Route path="/payment/result" element={<Payment_result/>} />
              <Route path="/google/callback" element={<Google_callback />} />

              <Route path="/cuestion" element={<Cuestion_card/>} />

              <Route path="/register" element ={<Layout_register/>}>
                <Route path="admin" element={<Register_admin/>}/>
                <Route path="coffeeLover" element={<Register_coffeelover/>}/>
                <Route path="criteria" element={<Register_criteria/>}/>
                <Route path="store" element={<Register_store/>}/>
                <Route path="branch/:storeId" element={<Register_branch/>}/>
              </Route>
                  

              {/* PRIVATE ROUTES  */}
              <Route element={<PrivateRoute />}>
                <Route element={<RoleRoute allowedRoles={[ROLES.COFFEE_LOVER]} />}>
                  
                  <Route path="/coffeelover" element={<Layout_coffelover />}>
                    <Route index element={<Principal_coffeelover />} />
                    <Route path="review" element={<Reviews/>} />
                    <Route path="Profile" element={<Profile_coffeelover/>} />
                    <Route path="map-coffelover" element={<Map/>} />
                    <Route path="details" element={<Details_store/>} />
                    <Route path="album" element={<List_Album />} />
                    <Route path="pruebas-album" element={<Album/>} />
                    <Route path="register-branch-visit/" element={<Register_visitStore/>}/>
                  </Route>

                  <Route path="/open-album" element={<Page_Album />} />

                </Route>

                <Route element={<RoleRoute allowedRoles={[ROLES.STORE]} />}>
                  <Route path="/stores" element={<Layout_store />}>
                    <Route index element={<Branch_management_AdminStore />} />
                  </Route>
                </Route>

                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN_SUCURSAL, ROLES.STORE]}/>}>
                  <Route path="/branch" element={<Layout_branch />}>
                    <Route index element={<Dashboard_branch />} />
                    <Route path="details" element={<Details_branch/>} />
                    <Route path="images" element={<Images_gallery/>} />
                    <Route path="profile" element={<Form_edit_branch />} />
                    <Route path="raitings" element={<Reviews_management/>}/>
                    <Route path="attributes" element={<Attributes_management/>}/>
                    <Route path="payments" element={<Payments_management/>} />
                  </Route>
                </Route>

                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route path="/admin" element={<Layout_admin />}>
                    <Route path="dashboard" element={<Dashboard_admin/>} />
                    <Route index element={<Branch_Management />} />
                    <Route path="albums" element={<Album_management />} />
                    <Route path="event" element={<Event_management />} />
                    <Route path="form-event" element={<Register_events />} />
                  </Route>
                </Route>

              </Route>

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />

            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default AuthRoutes;
