export type ProductSchema = {
    id: string;
    name: string;
    description: string;
    brand: string;
    category: string;
    organization_id: string;
    total_in_stock: number;
    created_at: string;
    updated_at: string;
};

export type CreateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "total_in_stock" | "created_at" | "updated_at"
>;

export type UpdateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "total_in_stock" | "created_at" | "updated_at"
>;
