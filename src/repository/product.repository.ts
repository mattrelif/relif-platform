import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "product-types";

export async function createProduct(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function getProductById(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "GET",
    });
}

export async function updateProduct(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "PUT",
    });
}

export async function deleteProduct(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "DELETE",
    });
}
