import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "voluntary-people";

export async function createVolunteer(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function getVolunteerById(volunteerId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "GET",
    });
}

export async function getVoluntariesByOrganizationID(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/voluntary-people?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function updateVolunteer(volunteerId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "PUT",
    });
}

export async function deleteVolunteer(volunteerId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "DELETE",
    });
}
