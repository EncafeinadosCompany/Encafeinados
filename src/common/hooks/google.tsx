import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {  setAuthStorageGoogle } from "../utils/auth_storage.utils";


const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenResponse = urlParams.get("accessToken");
      const userDataParam = urlParams.get("user");

      if (!tokenResponse || !userDataParam) {
        toast.error("Error en la autenticación.");
        navigate("/login");
        return;
      }

      console.log(tokenResponse);


      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        
        setAuthStorageGoogle(tokenResponse, userData);
        toast.success("Inicio de sesión exitoso");
        navigate("/coffeelover");
      } catch (error) {
        console.error("Error al procesar los datos de autenticación:", error);
        navigate("/login");
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Autenticando...</p>;
};

export default GoogleCallback;