import { initializeApp } from "firebase/app";
import {
  Auth, getAuth, GoogleAuthProvider, signInWithPopup, AuthError,
  UserCredential, signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}




const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export const signInWithGoogle = async () => {
  try {

    const authWindow = window.location.href = 'http://localhost:3000/api/v2/auth/google'
    if (!authWindow) {
      throw new Error('No se pudo abrir la ventana de autenticación');
    }
  } catch (error) {
    console.error("Error en login con Google:", error);

    if ((error as { code: string }).code === 'auth/popup-closed-by-user') {
      throw new Error('El usuario cerró la ventana de autenticación');
    } else if ((error as { code: string }).code === 'auth/cancelled-popup-request') {
      throw new Error('Solicitud de autenticación cancelada');
    } else {
      throw error;
    }
  }
};


export const registerWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    return {
      user,
      token,
      additionalInfo: {
        isNewUser: (result as any).additionalUserInfo?.isNewUser || false
      }
    };
  } catch (error) {
    console.error("Error en registro con Google:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export { auth };

