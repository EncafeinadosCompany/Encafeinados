
import { getAuthStorage } from "@/common/utils/security/auth_storage.utils";
import { ROLES } from "@/common/utils/lists/roles.utils";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({ allowedRoles }: RouteProps) => {
    const user = getEncryptedItem("user") || {};

    console.log("User from storage:", user);
    if (!user) return <Navigate to="/login" replace />

    const userRole = (user as { role: string }).role;

    console.log("User role:", userRole);

    if (!allowedRoles.includes(userRole) && userRole === ROLES.COFFEE_LOVER) {
        toast.error("Te invitamos a iniciar sesión :)",{icon: "🔒", duration: 5000})
        localStorage.removeItem("user")
        return <Navigate to="/login" />;
      }
    
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized"  />;
      }
    return <Outlet />
}

export default RoleRoute