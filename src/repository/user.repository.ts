import { client } from "@/lib/axios-client";
import { UpdateUserRequest } from "@/types/user.types";
import { AxiosResponse } from "axios";

const PREFIX = "users";

export async function findUser(userId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "GET",
    });
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "PUT",
        data,
    });
}

export async function deleteUser(userId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "DELETE",
    });
}
