
import { getAuthStorage } from "@/common/utils/auth_storage.utils";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () =>{
    const {token} = getAuthStorage();
    return token ? <Outlet /> : <Navigate to="/" replace/>
}

export default PrivateRoute