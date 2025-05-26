import { getAuthStorage} from "@/common/utils/auth_storage.utils";
import { useAutoLogout } from "@/common/utils/token.utils";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { token } = getAuthStorage();

    useAutoLogout()

    if (!token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
