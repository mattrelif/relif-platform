import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance } from "axios";

const isLocalhost = false;

const host = isLocalhost ? BFFConfig.localhost : BFFConfig.host;

const client: AxiosInstance = axios.create({
    baseURL: host,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
    withCredentials: true,
});

export { client };
