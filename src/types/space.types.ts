export type SpaceSchema = {
    id: string;
    housing_id: string;
    name: string;
    status: string;
    total_vacancies: number;
    available_vacancies: number;
    created_at: string;
    updated_at: string;
};

export type CreateSpaceRequest = Omit<
    SpaceSchema,
    "id" | "housing_id" | "status" | "available_vacancies" | "created_at" | "updated_at"
>;

export type UpdateSpaceRequest = Omit<
    SpaceSchema,
    "id" | "housing_id" | "available_vacancies" | "created_at" | "updated_at"
>;
