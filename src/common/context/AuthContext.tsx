// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { verifyToken } from '../../api/auth';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   profilePicture?: string;
//   authType: 'local' | 'google';
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   setUser: (user: User | null) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const storedUser = localStorage.getItem('user');
      
//       if (storedUser) {
//         try {
//           // Verificar si el token es válido
//           const isValid = await verifyToken();
          
//           if (isValid) {
//             setUser(JSON.parse(storedUser));
//           } else {
//             localStorage.removeItem('user');
//             localStorage.removeItem('token');
//           }
//         } catch (error) {
//           console.error('Error al verificar la autenticación:', error);
//           localStorage.removeItem('user');
//           localStorage.removeItem('token');
//         }
//       }
      
//       setIsLoading(false);
//     };
    
//     initAuth();
//   }, []);

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     setUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };