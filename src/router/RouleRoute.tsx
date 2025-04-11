
import { queryClient } from "@/api/queryClient";
import { getAuthStorage } from "@/common/utils/authStorage";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({ allowedRoles }: RouteProps) => {
    const {user} = getAuthStorage() 

    if (!user) return <Navigate to="/login" replace />
    if (!allowedRoles.includes((user as { role: string }).role)) return <Navigate to="/unauthorized" replace />
    return <Outlet />
}

export default RoleRoute