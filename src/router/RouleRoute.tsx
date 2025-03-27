import { all } from "cypress/types/bluebird";
import { Navigate , Outlet } from "react-router-dom";

type RouteProps = {
    allowedRoles: string[]
}

const RoleRoute = ({allowedRoles}: RouteProps) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    console.log(user)
    if(!token) return <Navigate to="/login" replace />
    if(!allowedRoles.includes(user.role.name)) return <Navigate to="/unauthorized" replace />

    return <Outlet/> 
}

export default RoleRoute