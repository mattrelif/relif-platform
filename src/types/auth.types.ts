import { CreateUserSchema } from "./user.types";

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignUpRequest = CreateUserSchema;

export type PasswordChangeRequestSchema = {
    user_id: string;
    code: string;
    expires_at: string;
};

export type SessionSchema = {
    user_id: string;
    session_id: string;
    expires_at: string;
};

export type RequestPasswordChangeRequest = {
    email: string;
};

export type UpdatePasswordRequest = {
    new_password: string;
};
