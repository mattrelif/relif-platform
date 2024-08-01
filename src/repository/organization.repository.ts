import { client } from "@/lib/axios-client";
import {
    CreateOrganizationRequest,
    OrganizationDataAccessSchema,
    OrganizationSchema,
    UpdateOrganizationRequest,
} from "@/types/organization.types";
import {
    JoinOrganizationInviteSchema,
    JoinOrganizationRequestSchema,
} from "@/types/requests.types";
import { UserSchema } from "@/types/user.types";
import { AxiosResponse } from "axios";

const PREFIX = "organizations";

export async function createOrganization(data: CreateOrganizationRequest): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
        data,
    });
}

export async function findOrganizationByID(
    orgId: string
): Promise<AxiosResponse<OrganizationSchema>> {
    return client.request({
        url: `${PREFIX}/${orgId}`,
        method: "GET",
    });
}

export async function updateOrganization(
    orgId: string,
    data: UpdateOrganizationRequest
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}`,
        method: "PUT",
        data,
    });
}

export async function findAllOrganizations(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "GET",
    });
}

export async function findUsersByOrganizationId(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ data: UserSchema[]; count: number }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/users?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function findJoinInvitesByOrganizationId(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: JoinOrganizationInviteSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-invites?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function findJoinRequestsByOrganizationId(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: JoinOrganizationRequestSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-requests?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function findDataAccessRequestsByOrganizationId(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/data-accesses-requests?offset=${offset}&limit=${limit}`,
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
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: OrganizationDataAccessSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-platform-invites?offset=${offset}&limit=${limit}`,
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
