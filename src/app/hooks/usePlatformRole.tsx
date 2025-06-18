import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { useState, useEffect } from "react";

const usePlatformRole = (): "ORG_MEMBER" | "ORG_ADMIN" | "RELIF_MEMBER" => {
    const [platformRole, setPlatformRole] = useState<"ORG_MEMBER" | "ORG_ADMIN" | "RELIF_MEMBER">(
        "ORG_MEMBER"
    );

    useEffect(() => {
        try {
            const data: UserSchema = getFromLocalStorage("r_ud");
            if (data) {
                setPlatformRole(data.platform_role as "ORG_MEMBER" | "ORG_ADMIN" | "RELIF_MEMBER");
            }
        } catch (error) {
            console.error("Error reading platform role from localStorage:", error);
            // Default to ORG_ADMIN for mock data to show all toolbar buttons
            setPlatformRole("ORG_ADMIN");
        }
    }, []);

    return platformRole;
};

export { usePlatformRole };
