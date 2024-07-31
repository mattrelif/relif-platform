import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "housing-rooms";

export async function createSpace(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function getSpaceById(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "GET",
    });
}

export async function updateSpace(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "PUT",
    });
}

export async function deleteSpace(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "DELETE",
    });
}

export async function getBeneficiariesBySpaceId(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}/beneficiaries`,
        method: "GET",
    });
}

export async function getAllocationsBySpaceId(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}/allocations`,
        method: "GET",
    });
}
