import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-organization-requests";

export async function createRequest(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function acceptRequest(requestId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${requestId}`,
        method: "DELETE",
    });
}

export async function rejectRequest(requestId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${requestId}`,
        method: "DELETE",
    });
}
