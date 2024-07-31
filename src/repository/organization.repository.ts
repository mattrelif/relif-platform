import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "organizations";

export async function createOrganization(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function updateOrganization(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}`,
        method: "PUT",
    });
}

export async function findAllOrganizations(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "GET",
    });
}

export async function findUsersByOrganizationId(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/users`,
        method: "GET",
    });
}

export async function findJoinInvitesByOrganizationId(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-invites`,
        method: "GET",
    });
}

export async function findJoinRequestsByOrganizationId(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-requests`,
        method: "GET",
    });
}

export async function findDataAccessRequestsByOrganizationId(
    orgId: string
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/data-accesses-requests`,
        method: "GET",
    });
}

export async function findUpdateOrganizationTypeRequestsByOrganizationId(
    orgId: string
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/update-organization-type-requests`,
        method: "GET",
    });
}

export async function findHousingsByOrganizationId(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/housings`,
        method: "GET",
    });
}

export async function findJoinPlatformInvitesByOrganizationId(
    orgId: string
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-platform-invites`,
        method: "GET",
    });
}

export async function findVoluntaryPeopleByOrganizationID(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/voluntary-people`,
        method: "GET",
    });
}

export async function findProductTypesByOrganizationId(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/product-types`,
        method: "GET",
    });
}
