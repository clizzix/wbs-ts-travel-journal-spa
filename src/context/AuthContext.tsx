import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginFormData, SignupFormData, User } from '@/types';
import {
    login as loginRequest,
    logout as logoutRequest,
    me as meRequest,
    refresh,
    register as registerRequest,
} from '@/data';

type AuthContextValue = {
    signedIn: boolean;
    user: User | null;
    checkSession: boolean;
    handleLogin: (credentials: LoginFormData) => Promise<void>;
    handleRegister: (credentials: SignupFormData) => Promise<void>;
    handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

type AuthProviderProps = { children: ReactNode };

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [checkSession, setCheckSession] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const refreshAndStore = async () => {
                const { accessToken } = await refresh();
                localStorage.setItem('accessToken', accessToken);
            };

            const fetchProfile = async () => {
                const data = await meRequest();
                setUser(data.user);
                setSignedIn(true);
            };
            try {
                if (!localStorage.getItem('accessToken')) {
                    await refreshAndStore();
                }
                await fetchProfile();
            } catch (error) {
                console.error(error);
                try {
                    await refreshAndStore();
                    await fetchProfile();
                } catch (refreshError) {
                    console.error(refreshError);
                    localStorage.removeItem('accessToken');
                    setSignedIn(false);
                    setUser(null);
                }
            } finally {
                setCheckSession(false);
            }
        };

        if (checkSession) getUser();
    }, [checkSession]);

    const handleLogin = async (credentials: LoginFormData) => {
        const { accessToken } = await loginRequest(credentials);
        localStorage.setItem('accessToken', accessToken);
        setCheckSession(true);
    };

    const handleRegister = async (credentials: SignupFormData) => {
        const { accessToken } = await registerRequest(credentials);
        localStorage.setItem('accessToken', accessToken);
        setCheckSession(true);
    };

    const handleLogout = async () => {
        await logoutRequest();
        localStorage.removeItem('accessToken');
        setUser(null);
        setSignedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                signedIn,
                user,
                checkSession,
                handleLogin,
                handleRegister,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
