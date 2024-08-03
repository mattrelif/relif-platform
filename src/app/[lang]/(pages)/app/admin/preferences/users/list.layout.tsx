"use client";

import { findUsersByOrganizationId } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { UserCard } from "./card.layout";

const UserList = (): ReactNode => {
    const [currentUserId, setCurrentUserId] = useState("");
    const [data, setData] = useState<{ data: UserSchema[]; count: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getUserList = async () => {
        try {
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (currentUser.organization_id) {
                const OFFSET = 0;
                const LIMIT = 9999;
                const response = await findUsersByOrganizationId(
                    currentUser.organization_id,
                    OFFSET,
                    LIMIT
                );
                setData(response.data);
                setCurrentUserId(currentUser.id);
            } else {
                throw new Error();
            }
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        (async () => await getUserList())();
    }, []);

    return (
        <ul className="w-full h-[calc(100vh-316px)] border-[1px] border-slate-200 rounded-md p-2 mt-4 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
            {isLoading && (
                <h2 className="p-2 text-relif-orange-400 font-medium text-sm">Loading...</h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!isLoading && !error && !data && (
                <span className="text-sm text-slate-900 font-medium">No users found...</span>
            )}

            {!isLoading &&
                !error &&
                data &&
                data.data?.map(user => (
                    <UserCard {...user} currentUserId={currentUserId} refreshList={getUserList} />
                ))}
        </ul>
    );
};

export { UserList };
