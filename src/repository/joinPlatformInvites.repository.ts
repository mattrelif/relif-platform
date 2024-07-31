import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-platform-invites";

export async function createInvite(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function consumeInvite(code: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${code}/consume`,
        method: "DELETE",
    });
}
