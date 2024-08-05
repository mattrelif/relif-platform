import {
    AddressSchema,
    DocumentSchema,
    EmergencyContactSchema,
    MedicalInformationSchema,
} from "./commons.types";
import { HousingSchema } from "./housing.types";
import { SpaceSchema } from "./space.types";

export type BeneficiarySchema = {
    id: string;
    full_name: string;
    email: string;
    documents: DocumentSchema[];
    birthdate: string;
    gender: string;
    occupation: string;
    phones: string[];
    civil_status: string;
    spoken_languages: string[];
    education: string;
    address: AddressSchema;
    status: string;
    current_housing: HousingSchema;
    current_housing_id: string;
    current_room: SpaceSchema;
    current_room_id: string;
    medical_information: MedicalInformationSchema;
    emergency_contacts: EmergencyContactSchema[];
    created_at: string;
    updated_at: string;
    notes: string;
};

export type BeneficiaryAllocationSchema = {
    id: string;
    beneficiary_id: string;
    old_housing_id: string;
    old_room_id: string;
    housing_id: string;
    room_id: string;
    type: string;
    auditor_id: string;
    created_at: string;
    exit_date: string;
    exit_reason: string;
};

export type CreateBeneficiaryRequest = Omit<
    BeneficiarySchema,
    "id" | "status" | "current_housing_id" | "current_room_id" | "created_at" | "updated_at"
>;

export type UpdateBeneficiaryRequest = Omit<
    BeneficiarySchema,
    "id" | "status" | "current_housing_id" | "current_room_id" | "created_at" | "updated_at"
>;

export type AllocateBeneficiaryRequest = {
    housing_id: string;
    room_id: string;
};

export type ReallocateBeneficiaryRequest = {
    housing_id: string;
    room_id: string;
    exit_reason: string;
};
