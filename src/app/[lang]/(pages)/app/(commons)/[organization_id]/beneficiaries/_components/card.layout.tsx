"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate, calculateAge } from "@/utils/formatDate";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBirthdayCake, FaEdit, FaEye, FaHome, FaMapMarkerAlt, FaTrash, FaUserCheck } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";

import { MoveModal } from "./move.modal";
import { RemoveModal } from "./remove.modal";
import { StatusModal } from "./status.modal";

type Props = BeneficiarySchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const [moveDialogOpenState, setMoveDialogOpenState] = useState(false);
    const [statusDialogOpenState, setStatusDialogOpenState] = useState(false);

    const beneficiaryPath = pathname.split("/").slice(0, 5).join("/");
    const housingPath = pathname.split("/").slice(0, 4).join("/");
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const age = calculateAge(data.birthdate);
    const isUnderage = age < 18;

    const GENDER_MAPPING = {
        male: dict.commons.beneficiaries.card.gender.male,
        female: dict.commons.beneficiaries.card.gender.female,
        "non-binary": dict.commons.beneficiaries.card.gender.nonBinary,
        "prefer-not-to-say": dict.commons.beneficiaries.card.gender.preferNotToSay,
        transgender: dict.commons.beneficiaries.card.gender.transgender,
        "gender-fluid": dict.commons.beneficiaries.card.gender.genderFluid,
        agender: dict.commons.beneficiaries.card.gender.agender,
        other: dict.commons.beneficiaries.card.gender.other,
    };

    const handleViewProfileClick = (e: any) => {
        e.stopPropagation();
        router.push(`${beneficiaryPath}/${data?.id}`);
    };

    const handleViewHousingClick = (e: any) => {
        e.stopPropagation();
        router.push(`${housingPath}/housings/${data?.current_housing_id}`);
    };

    const handleEditClick = (e: any) => {
        e.stopPropagation();
        router.push(`${beneficiaryPath}/${data?.id}/edit`);
    };

    const handleStatusClick = (e: any) => {
        e.stopPropagation();
        setStatusDialogOpenState(true);
    };

    const handleRemoveClick = (e: any) => {
        e.stopPropagation();
        setRemoveDialogOpenState(true);
    };

    const handleMoveClick = (e: any) => {
        e.stopPropagation();
        setMoveDialogOpenState(true);
    };

    return (
        <>
            <li
                className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4"
                onClick={() => router.push(`${beneficiaryPath}/${data?.id}`)}
            >
                <div className="flex gap-4">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src={data.image_url} className="object-cover" />
                        <AvatarFallback className="bg-relif-orange-200 text-white">
                            {data?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-900 font-bold">
                            {data?.full_name ? convertToTitleCase(data.full_name) : "Unknown Name"}
                        </span>
                        <span className="text-xs text-slate-900 font-medium mt-1 flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {data?.current_housing_id
                                ? `${convertToTitleCase(data?.current_housing?.name || "Unknown Housing")} | ${data?.current_room?.name || "Unknown Room"}`
                                : dict.commons.beneficiaries.card.unallocated}
                        </span>
                        <span className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                            <FaBirthdayCake /> {data?.birthdate ? formatDate(data.birthdate, locale || "en") : "No birthdate"} ({age > 0 ? age : "Unknown"}{" "}
                            {age > 0 ? dict.commons.beneficiaries.card.yearsOld : "age"})
                        </span>
                        <span className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {data?.gender ? convertToTitleCase(GENDER_MAPPING[data.gender as keyof typeof GENDER_MAPPING] || data.gender) : "Unknown gender"}
                            {isUnderage && (
                                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                                    {dict.commons.beneficiaries.card.underage}
                                </Badge>
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="sm"
                                        variant="icon"
                                        className="w-7 h-7 p-0 flex items-center justify-center"
                                        onClick={handleViewProfileClick}
                                    >
                                        <FaEye />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{dict.commons.beneficiaries.card.dropdownMenu.profile}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="sm"
                                        variant="icon"
                                        className="w-7 h-7 p-0 flex items-center justify-center"
                                        onClick={handleViewHousingClick}
                                        disabled={!data?.current_housing_id}
                                    >
                                        <FaHome />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{dict.commons.beneficiaries.card.dropdownMenu.viewHousing}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {platformRole === "ORG_ADMIN" && (
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                size="sm"
                                                variant="icon"
                                                className="w-7 h-7 p-0 flex items-center justify-center"
                                                onClick={handleEditClick}
                                            >
                                                <FaEdit />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{dict.commons.beneficiaries.card.dropdownMenu.editBeneficiary}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                size="sm"
                                                variant="icon"
                                                className="w-7 h-7 p-0 flex items-center justify-center"
                                                onClick={handleStatusClick}
                                            >
                                                <FaUserCheck />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Change Status</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                size="sm"
                                                variant="icon"
                                                className="w-7 h-7 p-0 flex items-center justify-center"
                                                onClick={handleMoveClick}
                                            >
                                                <IoMdMove />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{dict.commons.beneficiaries.card.dropdownMenu.moveToOtherHousing}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                size="sm"
                                                variant="icon"
                                                className="w-7 h-7 p-0 flex items-center justify-center"
                                                onClick={handleRemoveClick}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{dict.commons.beneficiaries.card.dropdownMenu.removeBeneficiary}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-end lg:items-start lg:hidden">
                        <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            {dict.commons.beneficiaries.card.createdAt}{" "}
                            {formatDate(data?.created_at, locale || "en")}
                        </span>
                        <span>
                            <Badge 
                                className={
                                    data.status === 'ACTIVE' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                    data.status === 'INACTIVE' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                    data.status === 'PENDING' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                    data.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                                    'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }
                            >
                                {data.status === 'ACTIVE' ? 'Active' :
                                 data.status === 'INACTIVE' ? 'Inactive' :
                                 data.status === 'PENDING' ? 'Pending' :
                                 data.status === 'ARCHIVED' ? 'Archived' :
                                 data.status}
                            </Badge>
                        </span>
                    </div>
                </div>
            </li>

            <RemoveModal
                beneficiary={data}
                refreshList={refreshList}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />

            <MoveModal
                beneficiary={data}
                refreshList={refreshList}
                moveDialogOpenState={moveDialogOpenState}
                setMoveDialogOpenState={setMoveDialogOpenState}
            />

            <StatusModal
                beneficiary={data}
                refreshList={refreshList}
                statusDialogOpenState={statusDialogOpenState}
                setStatusDialogOpenState={setStatusDialogOpenState}
            />
        </>
    );
};

export { Card };
