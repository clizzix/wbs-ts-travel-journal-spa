import type { Dispatch, SetStateAction, RefObject } from 'react';

export type DbEntry = {
    _id: string;
    createdAt: string;
    updatedAt?: string;
    __v: number;
};

export type PostInput = {
    title: string;
    author: string;
    image: string;
    content: string;
};

export type SignupFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type LoginFormData = {
    email: string;
    password: string;
};

export type UserRole = 'self' | 'user' | 'admin';

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: UserRole[];
    createdAt?: string;
    updatedAt?: string;
};

export type AuthTokenResponse = {
    message: string;
    accessToken: string;
};

export type MeResponse = {
    message: string;
    user: User;
};

export type DbPost = DbEntry & PostInput;

export type SetPost = Dispatch<SetStateAction<DbPost | null>>;

export type ModalRef = RefObject<HTMLDialogElement | null>;
