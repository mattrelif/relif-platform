import { client } from "@/lib/axios-client";
import { UpdateProductRequest } from "@/types/product.types";
import { AxiosResponse } from "axios";

const PREFIX = "product-types";

export async function getProductById(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "GET",
    });
}

export async function updateProduct(productId: string, data: UpdateProductRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "PUT",
        data,
    });
}

export async function deleteProduct(productId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "DELETE",
    });
}

export async function allocateProduct(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}/allocate`,
        method: "POST",
    });
}

export async function reallocateProduct(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}/reallocate`,
        method: "POST",
    });
}
