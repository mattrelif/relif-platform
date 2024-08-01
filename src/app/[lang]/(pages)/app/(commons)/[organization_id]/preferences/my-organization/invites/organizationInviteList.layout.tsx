"use client";

import { findDataAccessRequestsByOrganizationId } from "@/repository/organization.repository";
import { OrganizationDataAccessSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { OrganizationInvite } from "./organizationInvite.layout";

const OrganizationInviteList = (): ReactNode => {
    const [requests, setRequests] = useState<{
        count: number;
        data: OrganizationDataAccessSchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getRequests = async (organizationId: string) => {
        setIsLoading(true);
        setError(false);

        const OFFSET = 0;
        const LIMIT = 9999;
        const response = await findDataAccessRequestsByOrganizationId(
            organizationId,
            OFFSET,
            LIMIT
        );

        setRequests(response.data);
    };

    useEffect(() => {
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");
                const organizationId = currentUser.organization_id;

                if (organizationId) {
                    await getRequests(organizationId);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {isLoading && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-relif-orange-400 font-medium">Loading...</span>
                </div>
            )}

            {!error && !isLoading && requests?.count === 0 && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-slate-900 font-medium">
                        You have no requests...
                    </span>
                </div>
            )}

            {error && !isLoading && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <MdError />
                        Something went wrong. Please try again later.
                    </span>
                </div>
            )}

            {!error && !isLoading && requests?.count && requests?.count > 0 && (
                <ul className="w-full h-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    {requests?.data.map(request => <OrganizationInvite {...request} />)}
                </ul>
            )}
        </>
    );
};

export { OrganizationInviteList };
