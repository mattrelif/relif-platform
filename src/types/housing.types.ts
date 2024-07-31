import { AddressSchema } from "./commons.types";

export type HousingSchema = {
    id: string;
    organization_id: string;
    name: string;
    status: string;
    address: AddressSchema;
    created_at: string;
    updated_at: string;
};

export type CreateHousingRequest = Omit<
    HousingSchema,
    "id" | "organization_id" | "status" | "created_at" | "updated_At"
>;

export type UpdateHousingRequest = Omit<
    HousingSchema,
    "id" | "organization_id" | "status" | "created_at" | "updated_At"
>;
