export type UserPreferencesSchema = {
    language: string;
    timezone: string;
};

export type UserSchema = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phones: Array<string>;
    role: string;
    platform_role: string;
    status: string;
    country: string;
    preferences: UserPreferencesSchema;
    created_at: string;
    updated_at: string;
};

export type CreateUserRequest = Omit<
    UserSchema,
    "id" | "platform_role" | "status" | "created_at" | "updated_at"
>;

export type UpdateUserRequest = Omit<
    UserSchema,
    "id" | "platform_role" | "status" | "created_at" | "updated_at"
>;

export type UpdateUserPreferencesRequest = UserPreferencesSchema;
