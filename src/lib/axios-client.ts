import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: BFFConfig.host,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
});

client.interceptors.request.use(config => {
    const token = localStorage.getItem("r_to");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor for better error handling
client.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log successful responses for debugging
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error: AxiosError) => {
        // Enhanced error logging
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            code: error.code
        });

        // Check if it's actually a successful response that we're misinterpreting
        if (error.response?.status && error.response.status >= 200 && error.response.status < 300) {
            console.warn("⚠️ Response was successful but treated as error:", error.response);
            return Promise.resolve(error.response);
        }

        // For network errors or other issues
        if (!error.response) {
            console.error("🌐 Network error or request failed:", error.message);
        }

        return Promise.reject(error);
    }
);

export { client };
