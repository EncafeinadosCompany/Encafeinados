import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAuthStorage } from "../utils/authStorage";
import { use } from "chai";

const GoogleCallback = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchToken = async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const tokenResponse = urlParams.get('accessToken');
        const userData = urlParams.get('user');
        
        try {
  
          if (!tokenResponse || !userData) {
            toast.error("Error en la autenticación.");
            navigate("/login");
            return; 
          }
          setAuthStorage(tokenResponse, userData)
  
          toast.success("Inicio de sesión exitoso");
  
          // Redirigir a la página correspondiente
           navigate("/coffelover");
        } catch (error) {
          console.error("Error en la autenticación con Google:", error);
          toast.error("Error en la autenticación.");
          navigate("/login");
        }
      };
  
      fetchToken();
    }, [navigate]);
  
    return <p>Autenticando...</p>; // Mensaje de espera mientras se procesa la autenticación
  };
  
  export default GoogleCallback;