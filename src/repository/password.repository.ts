import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "password";

export async function requestChange(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/request-change`,
        method: "POST",
    });
}

export async function updatePassword(code: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${code}`,
        method: "PUT",
    });
}
