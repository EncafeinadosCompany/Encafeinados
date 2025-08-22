import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAuthStorageGoogle } from "../../utils/security/auth_storage.utils";
import { useAuth } from "./use_auth.hook";
import { saveEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { GetCoffeeLoverData } from "@/api/mutations/auth/authMutations";

interface GoogleTokenData {
  email: string;
  exp: number;
  iat: number;
  roles: string[];
  sub: number;
}

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenResponse = urlParams.get("accessToken");
      const { pagesPermissions } = useAuth();

      if (!tokenResponse) {
        toast.error("Error en la autenticación.");
        navigate("/login");
        return;
      }

      try {
        // Decodificar el token JWT para ver su contenido
        const decodeJWT = (token: string) => {
          try {
            // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
            const parts = token.split(".");
            if (parts.length !== 3) {
              console.error("Token JWT inválido - no tiene 3 partes");
              return null;
            }

            // Decodificar el payload (segunda parte)
            const payload = parts[1];
            // Agregar padding si es necesario
            const paddedPayload =
              payload + "=".repeat((4 - (payload.length % 4)) % 4);
            const decodedPayload = atob(paddedPayload);
            return JSON.parse(decodedPayload);
          } catch (error) {
            console.error("Error decodificando JWT:", error);
            return null;
          }
        };

        const tokenData: GoogleTokenData = decodeJWT(tokenResponse);

        setAuthStorageGoogle(tokenResponse);

        saveEncryptedItem("user", {
          id: String(tokenData?.sub),
          email: tokenData?.email,
          roles: tokenData?.roles || []
        })
        saveEncryptedItem("userId", String(tokenData?.sub) );
        toast.success("Inicio de sesión exitoso, ¡Bienvenido!");

        GetCoffeeLoverData(String(tokenData?.sub));

        pagesPermissions(tokenData?.roles || [], navigate);

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
