"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";

const OrganizationToken = (): ReactNode => {
    const { toast } = useToast();
    const [token, setToken] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const currentUser: UserSchema = getFromLocalStorage("r_ud");
            setToken(currentUser.organization_id as string);
        } catch {
            setError(true);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token).then(
            () => {
                toast({
                    title: "Success!",
                    description: "The organization token has been successfully copied.",
                    variant: "success",
                });
            },
            () => {
                toast({
                    title: "Error!",
                    description: "Failed to copy the organization token.",
                    variant: "destructive",
                });
            }
        );
    };

    if (error) return <div>Error loading token.</div>;

    return (
        <div>
            <Button onClick={copyToClipboard} className="flex items-center gap-2" variant="outline">
                <FaCopy />
                Copy Organization Token to Clipboard
            </Button>
        </div>
    );
};

export default OrganizationToken;
