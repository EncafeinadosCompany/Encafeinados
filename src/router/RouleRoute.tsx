import { Navigate , Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({allowedRoles}: RouteProps) => {
    // const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    // if(!token) return <Navigate to="/login" replace />
    if(!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />
    return <Outlet/> 
}


// const RoleRoute = ({allowedRoles}: RouteProps) => {
//     const token = localStorage.getItem('token')
//     // const user = JSON.parse(localStorage.getItem('user') || '{}')
//     const { user } = useAuth();
//     if(!token) return <Navigate to="/login" replace />
//     if(!user?.role || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />

//     return <Outlet/> 
// }

export default RoleRoute