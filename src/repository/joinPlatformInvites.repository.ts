import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-platform-invites";

export async function createInvite(invited_email: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
        data: { invited_email },
    });
}

export async function consumeInvite(code: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${code}/consume`,
        method: "DELETE",
    });
}
