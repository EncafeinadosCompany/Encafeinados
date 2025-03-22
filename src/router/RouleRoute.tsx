import { all } from "cypress/types/bluebird";
import { Navigate , Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: number[]
}

const RoleRoute = ({allowedRoles}: RouteProps) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    console.log(user)
    if(!token) return <Navigate to="/login" replace />
    if(!allowedRoles.includes(user.role_id)) return <Navigate to="/unauthorized" replace />

    return <Outlet/> 
}

export default RoleRoute