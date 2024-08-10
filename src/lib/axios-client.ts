import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: BFFConfig.host,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Origin: "http://app.relifaid.org",
    },
    withCredentials: true,
});

export { client };
