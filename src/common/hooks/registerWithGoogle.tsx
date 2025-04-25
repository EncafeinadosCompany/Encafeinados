import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { RegisterWithGoogle } from "@/api/firebase";
import { RegisterCoffelover } from "@/api";

export default function GoogleWithRegister() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    
    const handleGoogleAuth = async () => {
        try {
            const { user, token, isNewUser } = await RegisterWithGoogle();

            const userData: RegisterCoffelover = {
                userData: {
                    id_google: user.providerData[0]?.uid,
                    email: user.email || "",
                },
                personData: {
                    full_name: user.displayName || "",
                    type_document: "",
                    number_document: "",
                    phone_number: "",
                },
            };

            const datosIncompletos = !userData.personData.type_document || 
                !userData.personData.number_document || 
                !userData.personData.phone_number;

            if (isNewUser || datosIncompletos) {
                sessionStorage.setItem("tempUserData", JSON.stringify(userData));
                navigate("/completar-perfil");
            }
        } catch (error: any) {
            if (error.code === 'auth/popup-blocked') {
                toast.error("El navegador bloqueó la ventana de autenticación. Por favor, habilita las ventanas emergentes y haz clic en el botón para continuar.");
                setIsLoading(false);
            } else {
                toast.error("No se pudo conectar con Google. Intenta nuevamente.");
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        // Check if we have userData in URL parameters
        const urlParams = new URLSearchParams(location.search);
        const userDataParam = urlParams.get('userData');
        
        if (userDataParam) {
            try {
                const googleUserData = JSON.parse(decodeURIComponent(userDataParam));
                
                // Create userData object from URL parameters
                const userData: RegisterCoffelover = {
                    userData: {
                        id_google: googleUserData.googleId || "",
                        email: googleUserData.email || "",
                    },
                    personData: {
                        full_name: googleUserData.displayName || "",
                        type_document: "",
                        number_document: "",
                        phone_number: "",
                    },
                };
                
                // Store in session storage and navigate to complete profile
                sessionStorage.setItem("tempUserData", JSON.stringify(userData));
                navigate("/completar-perfil");
            } catch (error) {
                console.error('Error parsing user data:', error);
                toast.error("Error al procesar los datos de usuario. Intenta nuevamente.");
                setIsLoading(false);
            }
        } else {
            // If no userData in URL, proceed with normal Google auth flow
            handleGoogleAuth();
        }
    }, [navigate, location]);

    if (!isLoading) {
        return (
            <div className="text-center p-4">
                <p className="mb-4">Para continuar con Google:</p>
                <button 
                    onClick={handleGoogleAuth}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Iniciar sesión con Google
                </button>
            </div>
        );
    }

    return <p>Autenticando...</p>;
}