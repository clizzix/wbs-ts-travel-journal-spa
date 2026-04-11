import {
    createContext,
    useState,
    useEffect,
    type ReactNode
} from 'react';
import type { LoginFormData, SignupFormData, User } from '@/types';
import {
    login as loginRequest,
    logout as logoutRequest,
    me as meRequest,
    register as registerRequest
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
    undefined
);

type AuthProviderProps = { children: ReactNode };

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [checkSession, setCheckSession] = useState(true);

    useEffect(() => {
        if (!checkSession) return;
        (async () => {
            try {
                const accessToken = localStorage.getItem('accessToken') ?? '';
                const { user } = await meRequest(accessToken);
                setUser(user);
                setSignedIn(true);
            } catch {
                setUser(null);
                setSignedIn(false);
                localStorage.removeItem('accessToken');
            } finally {
                setCheckSession(false);
            }
        })();
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
                handleLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
