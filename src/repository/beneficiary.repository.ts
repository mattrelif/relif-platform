import { client } from "@/lib/axios-client";
import { BeneficiarySchema, UpdateBeneficiaryRequest } from "@/types/beneficiary.types";
import { AxiosResponse } from "axios";

const PREFIX = "beneficiaries";

export async function getBeneficiaryById(
    beneficiaryId: string
): Promise<AxiosResponse<BeneficiarySchema>> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}`,
        method: "GET",
    });
}

export async function updateBeneficiary(
    beneficiaryId: string,
    data: UpdateBeneficiaryRequest
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${beneficiaryId}`,
        method: "PUT",
        data,
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
