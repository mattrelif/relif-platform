import { OrganizationSchema } from "@/types/organization.types";

export type ProductSchema = {
    id: string;
    name: string;
    description: string;
    brand: string;
    category: string;
    organization_id: string;
    organization: OrganizationSchema;
    unit_type: string;
    storage_records: any[];
    created_at: string;
    updated_at: string;
};

export type CreateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "created_at" | "updated_at" | "organization" | "storage_records"
>;

export type UpdateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "created_at" | "updated_at" | "organization" | "storage_records"
>;

export type MoveProductRequest = {
    from: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    to: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    quantity: number;
};

export type AddProductRequest = {
    to: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    quantity: number;
};
