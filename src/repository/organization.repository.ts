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
    // Mock data for testing - comprehensive beneficiary list
    const mockBeneficiaries: BeneficiarySchema[] = [
        {
            id: "ben-001",
            full_name: "Maria Santos",
            email: "maria.santos@email.com",
            phones: ["+1 (555) 123-4567"],
            birthdate: "1985-03-15",
            gender: "Female",
            civil_status: "Married",
            spoken_languages: ["Spanish", "English"],
            education: "High School",
            occupation: "Retail Worker",
            address: {
                address_line_1: "123 Oak Street, Apt 4B",
                address_line_2: "",
                city: "Springfield",
                zip_code: "62701",
                district: "Downtown",
                country: "USA"
            },
            status: "ACTIVE",
            current_housing_id: "housing-001",
            current_housing: {} as HousingSchema,
            current_room_id: "room-001",
            current_room: {} as any,
            medical_information: {
                allergies: ["Peanuts"],
                current_medications: [],
                recurrent_medical_conditions: [],
                health_insurance_plans: ["Blue Cross Blue Shield"],
                blood_type: "O+",
                taken_vaccines: ["COVID-19", "Flu"],
                mental_health_history: [],
                height: 165,
                weight: 60,
                addictions: [],
                disabilities: [],
                prothesis_or_medical_devices: []
            },
            emergency_contacts: [
                {
                    relationship: "Spouse",
                    full_name: "Carlos Santos",
                    emails: ["carlos.santos@email.com"],
                    phones: ["+1 (555) 123-4568"]
                }
            ],
            documents: [
                { type: "ID", value: "ID123456789" },
                { type: "Social Security", value: "SSN987654321" }
            ],
            notes: "Family displaced due to apartment fire. Needs immediate housing assistance.",
            image_url: "",
            created_at: "2024-01-01T09:00:00Z",
            updated_at: "2024-01-20T14:30:00Z"
        },
        {
            id: "ben-002",
            full_name: "Ahmed Hassan",
            email: "ahmed.hassan@email.com",
            phones: ["+1 (555) 234-5678"],
            birthdate: "1990-07-22",
            gender: "Male",
            civil_status: "Single",
            spoken_languages: ["Arabic", "English"],
            education: "Bachelor's Degree",
            occupation: "Engineer (Seeking Employment)",
            address: {
                address_line_1: "456 Maple Avenue, Unit 12",
                address_line_2: "",
                city: "Springfield",
                zip_code: "62702",
                district: "North Side",
                country: "USA"
            },
            status: "ACTIVE",
            current_housing_id: "housing-002",
            current_housing: {} as HousingSchema,
            current_room_id: "room-002",
            current_room: {} as any,
            medical_information: {
                allergies: [],
                current_medications: [],
                recurrent_medical_conditions: [],
                health_insurance_plans: ["Medicaid"],
                blood_type: "A+",
                taken_vaccines: ["COVID-19"],
                mental_health_history: [],
                height: 175,
                weight: 70,
                addictions: [],
                disabilities: [],
                prothesis_or_medical_devices: []
            },
            emergency_contacts: [
                {
                    relationship: "Sister",
                    full_name: "Fatima Hassan",
                    emails: ["fatima.hassan@email.com"],
                    phones: ["+1 (555) 234-5679"]
                }
            ],
            documents: [
                { type: "Passport", value: "P123456789" },
                { type: "Work Authorization", value: "WA987654321" }
            ],
            notes: "Recent immigrant seeking employment and ESL classes. Very motivated.",
            image_url: "",
            created_at: "2024-01-05T10:30:00Z",
            updated_at: "2024-01-18T16:45:00Z"
        },
        {
            id: "ben-003",
            full_name: "Elena Rodriguez",
            email: "elena.rodriguez@email.com",
            phones: ["+1 (555) 345-6789"],
            birthdate: "1988-11-08",
            gender: "Female",
            civil_status: "Divorced",
            spoken_languages: ["Spanish", "English"],
            education: "Some College",
            occupation: "Part-time Cashier",
            address: {
                address_line_1: "789 Pine Street",
                address_line_2: "",
                city: "Springfield",
                zip_code: "62703",
                district: "West Side",
                country: "USA"
            },
            status: "ACTIVE",
            current_housing_id: "housing-003",
            current_housing: {} as HousingSchema,
            current_room_id: "room-003",
            current_room: {} as any,
            medical_information: {
                allergies: ["Shellfish"],
                current_medications: ["Metformin 500mg daily"],
                recurrent_medical_conditions: ["Diabetes Type 2"],
                health_insurance_plans: ["Aetna"],
                blood_type: "B+",
                taken_vaccines: ["COVID-19", "Flu"],
                mental_health_history: [],
                height: 160,
                weight: 65,
                addictions: [],
                disabilities: [],
                prothesis_or_medical_devices: []
            },
            emergency_contacts: [
                {
                    relationship: "Mother",
                    full_name: "Rosa Rodriguez",
                    emails: ["rosa.rodriguez@email.com"],
                    phones: ["+1 (555) 345-6790"]
                }
            ],
            documents: [
                { type: "ID", value: "ID789123456" },
                { type: "Birth Certificate", value: "BC456789123" }
            ],
            notes: "Single mother seeking job training and childcare support. Very dedicated to improving situation.",
            image_url: "",
            created_at: "2024-01-08T14:15:00Z",
            updated_at: "2024-01-22T11:20:00Z"
        },
        {
            id: "ben-004",
            full_name: "David Kim",
            email: "david.kim@email.com",
            phones: ["+1 (555) 456-7890"],
            birthdate: "1995-02-14",
            gender: "Male",
            civil_status: "Single",
            spoken_languages: ["English"],
            education: "High School",
            occupation: "Veteran (Seeking Employment)",
            address: {
                address_line_1: "321 Elm Street, Apt 7A",
                address_line_2: "",
                city: "Springfield",
                zip_code: "62704",
                district: "East Side",
                country: "USA"
            },
            status: "ACTIVE",
            current_housing_id: "housing-004",
            current_housing: {} as HousingSchema,
            current_room_id: "room-004",
            current_room: {} as any,
            medical_information: {
                allergies: [],
                current_medications: ["Sertraline 50mg daily", "Lorazepam as needed"],
                recurrent_medical_conditions: [],
                health_insurance_plans: ["Medicare"],
                blood_type: "AB+",
                taken_vaccines: ["COVID-19", "Military vaccines"],
                mental_health_history: ["PTSD", "Anxiety Disorder"],
                height: 180,
                weight: 75,
                addictions: [],
                disabilities: ["PTSD"],
                prothesis_or_medical_devices: []
            },
            emergency_contacts: [
                {
                    relationship: "Mother",
                    full_name: "Susan Kim",
                    emails: ["susan.kim@email.com"],
                    phones: ["+1 (555) 456-7891"]
                }
            ],
            documents: [
                { type: "ID", value: "ID456789123" },
                { type: "Military ID", value: "MIL123456789" }
            ],
            notes: "Veteran seeking mental health support and job training. Making good progress in therapy.",
            image_url: "",
            created_at: "2024-01-12T08:45:00Z",
            updated_at: "2024-01-25T15:30:00Z"
        },
        {
            id: "ben-005",
            full_name: "Fatima Al-Zahra",
            email: "fatima.alzahra@email.com",
            phones: ["+1 (555) 567-8901"],
            birthdate: "1982-09-30",
            gender: "Female",
            civil_status: "Married",
            spoken_languages: ["Arabic", "English"],
            education: "Elementary School",
            occupation: "Homemaker",
            address: {
                address_line_1: "654 Cedar Avenue",
                address_line_2: "",
                city: "Springfield",
                zip_code: "62705",
                district: "South Side",
                country: "USA"
            },
            status: "ACTIVE",
            current_housing_id: "housing-005",
            current_housing: {} as HousingSchema,
            current_room_id: "room-005",
            current_room: {} as any,
            medical_information: {
                allergies: ["Penicillin"],
                current_medications: ["Lisinopril 10mg daily"],
                recurrent_medical_conditions: ["Hypertension"],
                health_insurance_plans: ["Medicaid"],
                blood_type: "O-",
                taken_vaccines: ["COVID-19"],
                mental_health_history: [],
                height: 155,
                weight: 58,
                addictions: [],
                disabilities: [],
                prothesis_or_medical_devices: []
            },
            emergency_contacts: [
                {
                    relationship: "Husband",
                    full_name: "Omar Al-Zahra",
                    emails: ["omar.alzahra@email.com"],
                    phones: ["+1 (555) 567-8902"]
                }
            ],
            documents: [
                { type: "ID", value: "ID567890123" },
                { type: "Immigration Document", value: "IMG123456789" }
            ],
            notes: "Large family needing comprehensive support including housing, education, and cultural integration services.",
            image_url: "",
            created_at: "2024-01-15T13:20:00Z",
            updated_at: "2024-01-28T10:15:00Z"
        }
    ];

    // Filter by search term if provided
    let filteredBeneficiaries = mockBeneficiaries;
    if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        filteredBeneficiaries = mockBeneficiaries.filter(beneficiary =>
            beneficiary.full_name.toLowerCase().includes(searchLower) ||
            beneficiary.email.toLowerCase().includes(searchLower) ||
            beneficiary.phones.some(phone => phone.includes(search)) ||
            beneficiary.address.address_line_1.toLowerCase().includes(searchLower) ||
            beneficiary.address.city.toLowerCase().includes(searchLower)
        );
    }

    // Apply pagination
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);

    // Return mock response in the expected format
    return Promise.resolve({
        data: {
            count: filteredBeneficiaries.length,
            data: paginatedBeneficiaries
        }
    } as AxiosResponse<{ count: number; data: BeneficiarySchema[] }>);
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
