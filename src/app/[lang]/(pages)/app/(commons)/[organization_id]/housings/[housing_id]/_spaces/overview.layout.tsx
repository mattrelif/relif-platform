"use client";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getBeneficiariesBySpaceId } from "@/repository/spaces.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { SpaceSchema } from "@/types/space.types";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { BeneficiaryCard } from "../_beneficiaries/card.layout";

type Props = {
    space: SpaceSchema;
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const ViewSpace = ({ space, sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const getBeneficiariesList = async () => {
        (async () => {
            try {
                const response = await getBeneficiariesBySpaceId(space.id, OFFSET, LIMIT);
                setBeneficiaries(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    useEffect(() => {
        setIsLoading(true);
        getBeneficiariesList();
    }, []);

    const getStatus = () => {
        if (space.available_vacancies < 0) {
            return "SUPERCROWDED";
        } else if (space.total_vacancies > space.available_vacancies) {
            return "AVAILABLE";
        } else {
            return "FULL";
        }
    };

    const status = getStatus();

    const statusColor =
        status === "AVAILABLE"
            ? "border-l-green-500"
            : status === "FULL"
              ? "border-l-red-600"
              : "border-l-slate-900";

    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="py-4 px-4">
                <SheetHeader>
                    <SheetTitle>View space</SheetTitle>
                </SheetHeader>
                <div className="p-4 rounded-lg border border-relif-orange-200 border-dashed mt-4">
                    <h2 className="w-full text-relif-orange-200 text-xl font-bold flex items-center gap-2">
                        {space.name} <Badge className={statusColor}>{status}</Badge>
                    </h2>
                    <span className="text-sm text-slate-900">
                        {space.total_vacancies} beds, {space.available_vacancies} available
                    </span>
                </div>
                <h3 className="mt-8 text-slate-900 text-sm font-bold pb-2 flex items-center gap-2">
                    <FaUsers /> Beneficiaries present
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {isLoading && (
                        <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                            Loading...
                        </h2>
                    )}

                    {!isLoading && error && (
                        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                            <MdError />
                            Something went wrong. Please try again later.
                        </span>
                    )}

                    {!isLoading && !error && beneficiaries && beneficiaries.data.length <= 0 && (
                        <span className="text-sm text-slate-900 font-medium p-4">
                            No beneficiaries found...
                        </span>
                    )}

                    {!isLoading && !error && beneficiaries && beneficiaries.data.length > 0 && (
                        <ul className="w-full h-[calc(100vh-225px)] overflow-x-hidden overflow-y-scroll">
                            {beneficiaries?.data.map(beneficiary => (
                                <BeneficiaryCard type="current" {...beneficiary} />
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export { ViewSpace };
