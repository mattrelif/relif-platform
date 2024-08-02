import { client } from "@/lib/axios-client";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { AxiosResponse } from "axios";

const PREFIX = "beneficiaries";

export async function createBeneficiary(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function getBeneficiaryById(
    beneficiaryId: string
): Promise<AxiosResponse<BeneficiarySchema>> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}`,
        method: "GET",
    });
}

export async function getBeneficiariesByOrganizationID(
    organizationId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: BeneficiarySchema[] }>> {
    return client.request({
        url: `${PREFIX}/${organizationId}/beneficiaries?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function updateBeneficiary(beneficiaryId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}`,
        method: "PUT",
    });
}

export async function deleteBeneficiary(beneficiaryId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}`,
        method: "DELETE",
    });
}

export async function allocateBeneficiary(beneficiaryId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}/allocate`,
        method: "POST",
    });
}

export async function reallocateBeneficiary(beneficiaryId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}/reallocate`,
        method: "POST",
    });
}

export async function getAllocationByBeneficiaryId(beneficiaryId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}/allocations`,
        method: "GET",
    });
}
