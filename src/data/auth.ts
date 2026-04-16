import { VITE_APP_AUTH_SERVER_URL } from '@/config';
import type {
    AuthTokenResponse,
    LoginFormData,
    MeResponse,
    SignupFormData,
} from '@/types';

const baseURL = `${VITE_APP_AUTH_SERVER_URL}`;

type SuccessRes = { message: string };

export const register = async (
    credentials: SignupFormData,
): Promise<AuthTokenResponse> => {
    const res = await fetch(`${baseURL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
            errorData?.error ?? 'An error occurred during registration',
        );
    }
    const data = (await res.json()) as AuthTokenResponse;

    return data;
};

export const login = async (
    credentials: LoginFormData,
): Promise<AuthTokenResponse> => {
    const res = await fetch(`${baseURL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error ?? 'An error occurred during login');
    }

    const data = (await res.json()) as AuthTokenResponse;

    return data;
};

export const me = async (): Promise<MeResponse> => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`${baseURL}/me`, {
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
            errorData?.error ?? 'An error occurred fetching the profile',
        );
    }

    const { user } = (await res.json()) as SuccessRes & { user: MeResponse };
    return user;
};

export const refresh = async (): Promise<AuthTokenResponse> => {
    const res = await fetch(`${baseURL}/refresh`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error ?? 'Login required');
    }
    return res.json();
};

export const logout = async (): Promise<{ message: string }> => {
    const res = await fetch(`${baseURL}/logout`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error ?? 'An error occurred during logout');
    }

    const data = (await res.json()) as AuthTokenResponse;

    return data;
};
