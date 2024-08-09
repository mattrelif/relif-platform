"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HousingSchema } from "@/types/housing.types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import { RemoveModal } from "./remove.modal";

type Props = HousingSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const platformRole = usePlatformRole();
    const pathname = usePathname();
    const dict = useDictionary();

    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const getStatus = () => {
        const availableVacancies = data.total_vacancies - data.occupied_vacancies;

        if (availableVacancies < 0) {
            return "OVERCROWDED";
        }
        if (availableVacancies > 0) {
            return "AVAILABLE";
        }
        return "FULL";
    };

    const status = getStatus();

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data?.name}</span>
                <span className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {`${data?.address.address_line_1}, ${data?.address.address_line_2} - ${data?.address.city}, ${data?.address.district} | ${data?.address.zip_code} - ${data?.address.country}`}
                </span>
                <div className="flex flex-col gap-2 mt-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        {data.occupied_vacancies} {dict.housingList.beneficiaries} (
                        {((data.occupied_vacancies * 100) / data.total_vacancies)?.toFixed(0)}%{" "}
                        {dict.housingList.occupied})
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                        {status === "FULL" && (
                            <span>
                                <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-950">
                                    {dict.housingList.statusFull}
                                </Badge>
                            </span>
                        )}
                        {status === "AVAILABLE" && (
                            <span>
                                <Badge className="bg-green-500 text-slate-50 hover:bg-green-600">
                                    {dict.housingList.statusAvailable} (
                                    {data.total_vacancies - data.occupied_vacancies}{" "}
                                    {dict.housingList.availableBeds})
                                </Badge>
                            </span>
                        )}

                        {status === "OVERCROWDED" && (
                            <span>
                                <Badge className="bg-red-600 text-slate-50 hover:bg-red-700">
                                    {dict.housingList.statusOvercrowded}
                                </Badge>
                            </span>
                        )}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${data?.id}`}>
                                {dict.housingList.dropdownViewHousing}
                            </Link>
                        </DropdownMenuItem>
                        {platformRole === "ORG_ADMIN" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`${urlPath}/${data?.id}/edit`}>
                                        <span className="flex items-center gap-2">
                                            <FaEdit className="text-xs" />
                                            {dict.housingList.dropdownEditHousing}
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                                    <span className="flex items-center gap-2">
                                        <FaTrash className="text-xs" />
                                        {dict.housingList.dropdownRemoveHousing}
                                    </span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {dict.housingList.createdAt} {formatDate(data.created_at, locale || "en")}
                    </span>
                </div>
            </div>

            {platformRole === "ORG_ADMIN" && (
                <RemoveModal
                    housing={data}
                    refreshList={refreshList}
                    removeDialogOpenState={removeDialogOpenState}
                    setRemoveDialogOpenState={setRemoveDialogOpenState}
                />
            )}
        </li>
    );
};

export { Card };
