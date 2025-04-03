
import { queryClient } from "@/api/queryClient";
import { getAuthStorage } from "@/common/utils/authStorage";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({ allowedRoles }: RouteProps) => {

    // const queryClient = useQueryClient();

    // const cachedUser = queryClient.getQueryData(['user']);

    // const { data: user } = useQuery({
    //     queryKey: ['user'],
    //     queryFn: () => {
    //         return cachedUser || null;
    //     },

    //     initialData: cachedUser || null,
    //     staleTime: Infinity,
    //     enabled: !!cachedUser
    // });

    const {user} = getAuthStorage() 

    if (!user) return <Navigate to="/login" replace />
    console.log(user)
    if (!allowedRoles.includes((user as { role: string }).role)) return <Navigate to="/unauthorized" replace />
    return <Outlet />
}

export default RoleRoute