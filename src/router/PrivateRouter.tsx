
import { getAuthStorage } from "@/common/utils/authStorage";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () =>{

    // const { data: token } = useQuery({
    //     queryKey: ['authToken'],
    //     enabled: true,
    //     queryFn: () => {
    //         // Si no hay token en caché, puedes:
    //         // 1. Intentar recuperarlo de otra fuente
    //         // 2. Retornar null (lo que probablemente dirigirá al usuario al login)
    //         return null;
    //       },
    //     staleTime: Infinity,
    //   });

    const {token} = getAuthStorage();
    console.log(token)
    return token ? <Outlet /> : <Navigate to="/login" replace/>
}

export default PrivateRoute