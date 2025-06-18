
import { ROLES } from "@/common/utils/lists/roles.utils";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { getEncryptedItem, saveEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

type RouteProps = {
    allowedRoles: string[]
}
const RoleRoute = ({ allowedRoles }: RouteProps) => {
  const user = getEncryptedItem("user") || {};

  if (!user) {
    saveEncryptedItem("redirectAfterLogin", location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  const userRole = (user as { roles: string[] }).roles;

  console.log("User role from storage:", userRole,'holaa',  allowedRoles.includes(ROLES.COFFEE_LOVER));
  
  const roleValue = Array.isArray(userRole) ? userRole[0] : userRole;

  
  if (userRole.includes(ROLES.COFFEE_LOVER) && allowedRoles.includes(ROLES.COFFEE_LOVER)===false) {
    toast.error("Te invitamos a iniciar sesión :)", { icon: "🔒", duration: 5000 });
    saveEncryptedItem("redirectAfterLogin", location.pathname + location.search);

    localStorage.removeItem("user");
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.includes(roleValue)) {
    return <Outlet />;
  }
    // Si el usuario no tiene permisos
    console.error("Unauthorized access attempt by user:", userRole);
    return <Navigate to="/unauthorized" />;
  
  
};


export default RoleRoute