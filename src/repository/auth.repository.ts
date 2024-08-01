import { client } from "@/lib/axios-client";
import { SignUpRequest } from "@/types/auth.types";
import { UserSchema } from "@/types/user.types";
import { AxiosResponse } from "axios";

const PREFIX = "auth";

export async function signIn(email: string, password: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/sign-in`,
        method: "POST",
        data: { email, password },
    });
}

export async function signOut(): Promise<void> {
    await client.request({
        url: `${PREFIX}/sign-out`,
        method: "DELETE",
    });
}

export async function signUp(data: SignUpRequest): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/sign-up`,
        method: "POST",
        data: { ...data },
    });
}

export async function orgSignUp(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/orgSignUp`,
        method: "POST",
    });
}

export async function getMe(): Promise<AxiosResponse<UserSchema>> {
    return client.request({
        url: `${PREFIX}/me`,
        method: "GET",
    });
}
