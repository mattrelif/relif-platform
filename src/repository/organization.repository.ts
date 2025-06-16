import { client } from "@/lib/axios-client";
import { BeneficiarySchema, CreateBeneficiaryRequest } from "@/types/beneficiary.types";
import { HousingSchema } from "@/types/housing.types";
import {
    CreateOrganizationRequest,
    OrganizationDataAccessRequestSchema,
    OrganizationDataAccessSchema,
    OrganizationSchema,
    UpdateOrganizationRequest,
} from "@/types/organization.types";
import { CreateProductRequest } from "@/types/product.types";
import {
    JoinOrganizationInviteSchema,
    JoinOrganizationRequestSchema,
    UpdateOrganizationTypeRequestSchema,
} from "@/types/requests.types";
import { UserSchema } from "@/types/user.types";
import { CreateVoluntaryRequest, VoluntarySchema } from "@/types/voluntary.types";
import { AxiosResponse } from "axios";
import { CaseSchema, CreateCasePayload, UpdateCasePayload } from "@/types/case.types";

const PREFIX = "organizations";

export async function createOrganization(
    data: CreateOrganizationRequest
): Promise<AxiosResponse<OrganizationSchema>> {
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
): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}`,
        method: "PUT",
        data,
    });
}

export async function findAllOrganizations(
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: OrganizationSchema[] }>> {
    return client.request({
        url: `${PREFIX}?offset=${offset}&limit=${limit}`,
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
): Promise<AxiosResponse<{ count: number; data: OrganizationDataAccessRequestSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/targeted-data-access-requests?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function findUpdateOrganizationTypeRequestsByOrganizationId(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: UpdateOrganizationTypeRequestSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/update-organization-type-requests?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function findHousingsByOrganizationId(
    orgId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<{ count: number; data: HousingSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/housings?offset=${offset}&limit=${limit}&search=${search}`,
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

export async function getBeneficiariesByOrganizationID(
    organizationId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<{ count: number; data: BeneficiarySchema[] }>> {
    return client.request({
        url: `${PREFIX}/${organizationId}/beneficiaries?offset=${offset}&limit=${limit}&search=${search}`,
        method: "GET",
    });
}

export async function createBeneficiary(
    organizationId: string,
    data: CreateBeneficiaryRequest
): Promise<AxiosResponse<BeneficiarySchema>> {
    return client.request({
        url: `${PREFIX}/${organizationId}/beneficiaries`,
        method: "POST",
        data,
    });
}

export async function getVoluntariesByOrganizationID(
    orgId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<{ count: number; data: VoluntarySchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/voluntary-people?offset=${offset}&limit=${limit}&search=${search}`,
        method: "GET",
    });
}

export async function createVolunteer(orgId: string, data: CreateVoluntaryRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}/voluntary-people`,
        method: "POST",
        data,
    });
}

export async function createJoinOrganizationRequest(orgId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${orgId}/join-organization-requests`,
        method: "POST",
    });
}

export async function createDataAccessRequest(orgId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}/request-organization-data-access`,
        method: "POST",
    });
}

export async function getDataAccessGrants(
    orgId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: OrganizationSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${orgId}/data-access-grants?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function desativateOrganization(orgId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}`,
        method: "DELETE",
    });
}

export async function reactivateOrganization(orgId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}/reactivate`,
        method: "PUT",
    });
}

export async function getProductsByOrganizationID(
    orgId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<any>> {
    return client.request({
        url: `${PREFIX}/${orgId}/product-types?limit=${limit}&offset=${offset}&search=${search}`,
        method: "GET",
    });
}

export async function createProduct(orgId: string, data: CreateProductRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${orgId}/product-types`,
        method: "POST",
        data,
    });
}

// Case Management API Functions
export async function getCasesByOrganizationID(
    orgId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<{ count: number; data: CaseSchema[] }>> {
    return client.request({
        url: `cases?organization_id=${orgId}&offset=${offset}&limit=${limit}&search=${search}`,
        method: "GET",
    });
}

export async function getCaseById(caseId: string): Promise<AxiosResponse<CaseSchema>> {
    return client.request({
        url: `cases/${caseId}`,
        method: "GET",
    });
}

export async function createCase(data: CreateCasePayload): Promise<AxiosResponse<CaseSchema>> {
    return client.request({
        url: `cases`,
        method: "POST",
        data,
    });
}

export async function updateCase(
    caseId: string,
    data: UpdateCasePayload
): Promise<AxiosResponse<CaseSchema>> {
    return client.request({
        url: `cases/${caseId}`,
        method: "PUT",
        data,
    });
}

export async function deleteCase(caseId: string): Promise<AxiosResponse> {
    return client.request({
        url: `cases/${caseId}`,
        method: "DELETE",
    });
}

export async function getCaseStats(orgId: string): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/stats?organization_id=${orgId}`,
        method: "GET",
    });
}

// Case Documents API Functions
export async function getCaseDocuments(caseId: string): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/documents`,
        method: "GET",
    });
}

export async function generateCaseDocumentUploadLink(
    fileType: string
): Promise<AxiosResponse<{ link: string }>> {
    return client.request({
        url: `cases/generate-document-upload-link`,
        method: "POST",
        data: {
            file_type: fileType,
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function createCaseDocument(
    caseId: string,
    data: {
        document_name: string;
        document_type: string;
        description: string;
        tags: string[];
        file_url: string;
        file_name: string;
        file_size: number;
        mime_type: string;
    }
): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/documents`,
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// Legacy direct upload function (keep for compatibility)
export async function uploadCaseDocument(
    caseId: string,
    data: FormData
): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/documents`,
        method: "POST",
        data,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export async function deleteCaseDocument(caseId: string, docId: string): Promise<AxiosResponse> {
    return client.request({
        url: `cases/${caseId}/documents/${docId}`,
        method: "DELETE",
    });
}

// Case Notes API Functions
export async function getCaseNotes(caseId: string): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/notes`,
        method: "GET",
    });
}

export async function createCaseNote(caseId: string, data: any): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/notes`,
        method: "POST",
        data,
    });
}

export async function updateCaseNote(
    caseId: string,
    noteId: string,
    data: any
): Promise<AxiosResponse<any>> {
    return client.request({
        url: `cases/${caseId}/notes/${noteId}`,
        method: "PUT",
        data,
    });
}

export async function deleteCaseNote(caseId: string, noteId: string): Promise<AxiosResponse> {
    return client.request({
        url: `cases/${caseId}/notes/${noteId}`,
        method: "DELETE",
    });
}
