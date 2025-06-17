"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBirthdayCake, FaEdit, FaMapMarkerAlt, FaTrash, FaUserCheck } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { SlOptions } from "react-icons/sl";

import { MoveModal } from "./move.modal";
import { RemoveModal } from "./remove.modal";
import { StatusModal } from "./status.modal";

type Props = BeneficiarySchema & {
    refreshList: () => void;
};

const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        // eslint-disable-next-line no-plusplus
        age--;
    }

    return age > 0 ? age : 0;
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

    const handleDropdownItemClick = (e: any, url: string) => {
        e.stopPropagation();
        router.push(url);
    };

    return (
        <>
            <li
                className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4"
                onClick={() => router.push(`${beneficiaryPath}/${data?.id}`)}
            >
                <div className="flex gap-4">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src={data.image_url} />
                        <AvatarFallback className="bg-relif-orange-200 text-white">
                            {data?.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-900 font-bold">
                            {convertToTitleCase(data?.full_name)}
                        </span>
                        <span className="text-xs text-slate-900 font-medium mt-1 flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {data?.current_housing_id
                                ? `${convertToTitleCase(data?.current_housing.name)} | ${data?.current_room.name}`
                                : dict.commons.beneficiaries.card.unallocated}
                        </span>
                        <span className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                            <FaBirthdayCake /> {formatDate(data?.birthdate, locale || "en")} ({age}{" "}
                            {dict.commons.beneficiaries.card.yearsOld})
                        </span>
                        <div className="flex flex-wrap mt-2 gap-2">
                            {data.gender && (
                                <Badge>
                                    {GENDER_MAPPING[data?.gender as keyof typeof GENDER_MAPPING]}
                                </Badge>
                            )}
                            {isUnderage && (
                                <Badge className="bg-yellow-300 text-slate-900 hover:bg-yellow-500">
                                    {dict.commons.beneficiaries.card.underage}
                                </Badge>
                            )}
                            {!data?.current_room_id && (
                                <Badge className="bg-slate-200 text-slate-900 hover:bg-slate-400">
                                    {dict.commons.beneficiaries.card.unallocated}
                                </Badge>
                            )}
                        </div>
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
                            <DropdownMenuItem
                                onClick={e =>
                                    handleDropdownItemClick(e, `${beneficiaryPath}/${data?.id}`)
                                }
                            >
                                {dict.commons.beneficiaries.card.dropdownMenu.profile}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={e =>
                                    handleDropdownItemClick(
                                        e,
                                        `${housingPath}/housings/${data?.current_housing_id}`
                                    )
                                }
                                disabled={!data?.current_housing_id}
                            >
                                {dict.commons.beneficiaries.card.dropdownMenu.viewHousing}
                            </DropdownMenuItem>
                            {platformRole === "ORG_ADMIN" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={e =>
                                            handleDropdownItemClick(
                                                e,
                                                `${beneficiaryPath}/${data?.id}/edit`
                                            )
                                        }
                                    >
                                        <span className="flex items-center gap-2">
                                            <FaEdit className="text-xs" />
                                            {
                                                dict.commons.beneficiaries.card.dropdownMenu
                                                    .editBeneficiary
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={e => {
                                            e.stopPropagation();
                                            setStatusDialogOpenState(true);
                                        }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FaUserCheck className="text-xs" />
                                            Change Status
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={e => {
                                            e.stopPropagation();
                                            setRemoveDialogOpenState(true);
                                        }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FaTrash className="text-xs" />
                                            {
                                                dict.commons.beneficiaries.card.dropdownMenu
                                                    .removeBeneficiary
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={e => {
                                            e.stopPropagation();
                                            setMoveDialogOpenState(true);
                                        }}
                                    >
                                        <span className="flex items-center gap-2">
                                            <IoMdMove className="text-xs" />
                                            {
                                                dict.commons.beneficiaries.card.dropdownMenu
                                                    .moveToOtherHousing
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
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
