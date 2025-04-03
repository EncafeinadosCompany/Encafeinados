import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {  setAuthStorageGoogle } from "../utils/authStorage";


const GoogleCallback = () => {
    const navigate = useNavigate();

  
    useEffect(() => {
      const fetchToken = async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const tokenResponse = urlParams.get('accessToken');
        const userData = JSON.parse(urlParams.get('user') || '{}');
        
        try {
  
          if (!tokenResponse || !userData) {
            toast.error("Error en la autenticación.");
            navigate("/login");
            return; 
          }

          setAuthStorageGoogle(tokenResponse, userData)

          console.log(userData)
  
          toast.success("Inicio de sesión exitoso");
  
           navigate("/coffeelover");

        } catch (error) {
          console.error("Error en la autenticación con Google:", error);
          toast.error("Error en la autenticación.");
          navigate("/login");
        }
      };
  
      fetchToken();
    }, [navigate]);
  
    return <p>Autenticando...</p>; 
  };
  
  export default GoogleCallback;