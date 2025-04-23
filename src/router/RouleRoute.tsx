
import { getAuthStorage } from "@/common/utils/authStorage";
import { ROLES } from "@/common/utils/lists/roles";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({ allowedRoles }: RouteProps) => {
    const {user} = getAuthStorage() 

    if (!user) return <Navigate to="/login" replace />

    const userRole = (user as { role: string }).role;

    if (!allowedRoles.includes(userRole) && userRole === ROLES.COFFEE_LOVER) {
        toast.error("Te invitamos a iniciar sesión :)",{icon: "🔒", duration: 5000})
        return <Navigate to="/login" replace />;
      }
    
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
      }
    return <Outlet />
}

export default RoleRoute