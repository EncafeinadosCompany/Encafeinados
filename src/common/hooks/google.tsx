import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {  setAuthStorageGoogle } from "../utils/authStorage";


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

      try {
        // Decodificar los datos del usuario recibidos en la URL
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        
        setAuthStorageGoogle(tokenResponse, userData);

        toast.success("Inicio de sesión exitoso");
        navigate("/coffeelover");
      } catch (error) {
        console.error("Error al procesar los datos de autenticación:", error);
        // toast.error("Error en la autenticación.");
        navigate("/login");
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Autenticando...</p>;
};

export default GoogleCallback;