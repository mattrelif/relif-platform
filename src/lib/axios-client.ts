import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? BFFConfig.localhost : BFFConfig.host,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
    timeout: 30000, // 30 second timeout
    withCredentials: false, // Disable credentials for CORS
});

client.interceptors.request.use(config => {
    const token = localStorage.getItem("r_to");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CORS headers for better compatibility
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

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
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Enhanced error logging
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            code: error.code
        });

        // Handle specific error cases
        if (error.response?.status === 404 && error.config?.url?.includes('/stats')) {
            console.warn("📊 Stats endpoint not found, returning mock data");
            // Return mock stats data for missing endpoints
            return Promise.resolve({
                ...error.response,
                data: {
                    total_beneficiaries: 0,
                    active_beneficiaries: 0,
                    pending_beneficiaries: 0,
                    inactive_beneficiaries: 0,
                    total_cases: 0,
                    open_cases: 0,
                    overdue_cases: 0,
                    closed_this_month: 0,
                    total_volunteers: 0,
                    active_volunteers: 0,
                    pending_volunteers: 0,
                    inactive_volunteers: 0,
                    total_housing: 0,
                    available_housing: 0,
                    occupied_housing: 0,
                    maintenance_housing: 0,
                    total_inventory: 0,
                    low_stock_items: 0,
                    out_of_stock_items: 0,
                    recent_additions: 0
                },
                status: 200
            });
        }

        // Handle 502 Bad Gateway with retry logic
        if (error.response?.status === 502 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn("🔄 Retrying request due to 502 error...");
            
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                return await client(originalRequest);
            } catch (retryError) {
                console.error("🔄 Retry failed:", retryError);
            }
        }

        // Handle CORS errors
        if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
            console.error("🚫 CORS Error detected. This is likely a server configuration issue.");
            console.error("💡 Suggestion: Check if the API server has proper CORS headers configured.");
            
            // For development, you might want to use a proxy or configure the API server
            if (process.env.NODE_ENV === 'development') {
                console.warn("🛠️ Development mode: Consider using a proxy or updating API CORS settings");
            }
        }

        // Check if it's actually a successful response that we're misinterpreting
        if (error.response?.status && error.response.status >= 200 && error.response.status < 300) {
            console.warn("⚠️ Response was successful but treated as error:", error.response);
            return Promise.resolve(error.response);
        }

        // For network errors or other issues
        if (!error.response) {
            console.error("🌐 Network error or request failed:", error.message);
            
            // Check if it's a timeout
            if (error.code === 'ECONNABORTED') {
                console.error("⏱️ Request timed out after 30 seconds");
            }
        }

        return Promise.reject(error);
    }
);

export { client };
