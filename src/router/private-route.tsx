import { getAuthStorage} from "@/common/utils/security/auth_storage.utils";
import { useAutoLogout } from "@/common/utils/security/token.utils";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { token } = getAuthStorage();

    console.log("Token from storage:", token);

    useAutoLogout()

    if (!token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
