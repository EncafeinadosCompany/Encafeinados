
import { getAuthStorage } from "@/common/utils/authStorage";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () =>{
    const {token} = getAuthStorage();
    console.log(token)
    return token ? <Outlet /> : <Navigate to="/login" replace/>
}

export default PrivateRoute