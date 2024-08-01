import { client } from "@/lib/axios-client";
import { CreateHousingRequest, HousingSchema, UpdateHousingRequest } from "@/types/housing.types";
import { AxiosResponse } from "axios";

const PREFIX = "housings";

export async function createHousing(
    data: CreateHousingRequest
): Promise<AxiosResponse<HousingSchema>> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
        data,
    });
}

export async function getHousingById(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "GET",
    });
}

export async function updateHousing(
    housingId: string,
    data: UpdateHousingRequest
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "PUT",
        data,
    });
}

export async function deleteHousing(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "DELETE",
    });
}

export async function getSpacesByHousingId(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}/rooms`,
        method: "GET",
    });
}

export async function getBeneficiariesByHousingId(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}/beneficiaries`,
        method: "GET",
    });
}

export async function getAllocationsByHousingId(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}/allocations`,
        method: "GET",
    });
}
