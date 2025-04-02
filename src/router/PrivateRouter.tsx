
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () =>{

    const { data: token } = useQuery({
        queryKey: ['authToken'],
        enabled: true,
        queryFn: () => {
            // Si no hay token en caché, puedes:
            // 1. Intentar recuperarlo de otra fuente
            // 2. Retornar null (lo que probablemente dirigirá al usuario al login)
            return null;
          },
        staleTime: Infinity,
      });

      console.log(token)
    // const token = localStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/login" replace/>
}

export default PrivateRoute