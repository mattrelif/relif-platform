import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "password";

export async function requestChange(email: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/request-change`,
        method: "POST",
        data: { email },
    });
}

export async function updatePassword(code: string, newPassword: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${code}`,
        method: "PUT",
        data: { "new-password": newPassword },
    });
}
