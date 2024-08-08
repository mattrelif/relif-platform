"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Input } from "@/components/ui/input";
import { getSpacesByHousingId } from "@/repository/housing.repository";
import { SpaceSchema } from "@/types/space.types";
import { ReactNode, useEffect, useState } from "react";
import { MdError, MdSearch, MdSpaceDashboard } from "react-icons/md";

import { SpaceCard } from "./card.layout";
import { CreateSpace } from "./create.layout";

const SpaceList = ({ housingId }: { housingId: string }): ReactNode => {
    const dict = useDictionary();

    const [spaces, setSpaces] = useState<{
        count: number;
        data: SpaceSchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const getSpaceList = async () => {
        (async () => {
            try {
                const response = await getSpacesByHousingId(housingId, OFFSET, LIMIT);
                setSpaces(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    useEffect(() => {
        setIsLoading(true);
        getSpaceList();
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
            <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <MdSpaceDashboard />
                    {dict.housingOverview.spacesTitle}
                </h3>
                <CreateSpace housingId={housingId} refreshList={getSpaceList} />
            </div>
            <div className="flex items-center gap-2">
                <MdSearch className="text-slate-400 text-2xl" />
                <Input
                    type="text"
                    placeholder={dict.housingOverview.searchSpacePlaceholder}
                    className="w-full h-8"
                />
            </div>
            <div className="w-full h-[calc(100vh-520px)] border border-slate-200 rounded-md overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.housingOverview.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.housingOverview.error}
                    </span>
                )}

                {!isLoading && !error && spaces && spaces.data === null && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        {dict.housingOverview.noSpacesFound}
                    </span>
                )}

                {!isLoading && !error && spaces && spaces.data && spaces.data.length > 0 && (
                    <ul className="w-full h-full overflow-x-hidden overflow-y-scroll">
                        {spaces?.data.map(space => (
                            <SpaceCard refreshList={getSpaceList} {...space} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export { SpaceList };
