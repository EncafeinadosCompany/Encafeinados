import { createContext, useContext } from 'react';



type UserType = {
    role: string;
    email: string;
};

type AuthContextType = {
    user: UserType | null;
    setUser: (user: UserType) => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};