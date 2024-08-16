import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: BFFConfig.localhost,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
    withCredentials: true,
});

export { client };
