"use client";

import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { Card } from "./card.layout";

const StorageList = (): ReactNode => {
    const pathname = usePathname();
    const [housings, setHousings] = useState<{ count: number; data: HousingSchema[] } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                setIsLoading(true);
                const organizationId = pathname.split("/")[3];

                if (organizationId) {
                    const OFFSET = 0;
                    const LIMIT = 9999;
                    const response = await findHousingsByOrganizationId(
                        organizationId,
                        OFFSET,
                        LIMIT
                    );
                    setHousings(response.data);
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
        <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
            {isLoading && (
                <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!isLoading && !error && housings && housings.data.length <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-4">No housings found...</span>
            )}

            {!isLoading && !error && housings && housings.data.length > 0 && (
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    <Card storageName="Your organization" items={931} products={73} />

                    {housings?.data.map(housing => (
                        <Card
                            key={housing.id}
                            id={housing.id}
                            storageName={housing.name}
                            items={131}
                            products={7}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export { StorageList };
