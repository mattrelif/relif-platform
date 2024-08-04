"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBirthdayCake, FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { MoveModal } from "./move.modal";
import { RemoveModal } from "./remove.modal";

type Props = BeneficiarySchema & {
    refreshList: () => void;
};

const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age > 0 ? age : 0;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const [moveDialogOpenState, setMoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const beneficiaryPath = pathname.split("/").slice(0, 5).join("/");
    const housingPath = pathname.split("/").slice(0, 4).join("/");

    const age = calculateAge(data.birthdate);
    const isUnderage = age < 18;

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex gap-4">
                <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-relif-orange-200 text-white">
                        {data.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {convertToTitleCase(data?.full_name)}
                    </span>
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {/* TODO: NAME */}
                        {data?.current_room_id ? data?.current_room_id : "Unallocated"}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <FaBirthdayCake /> {data.birthdate} ({age} years old)
                    </span>
                    <div className="flex mt-2 gap-2">
                        <Badge>{convertToTitleCase(data.gender)}</Badge>
                        {isUnderage && (
                            <Badge className="bg-yellow-300 text-slate-900">Underage</Badge>
                        )}
                        {!data?.current_room_id && (
                            <Badge className="bg-slate-200 text-slate-900">Unallocated</Badge>
                        )}
                        {/* TODO: GENDER */}
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
                        <DropdownMenuItem asChild>
                            <Link href={`${beneficiaryPath}/${data.id}`}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild disabled={!data.current_housing_id}>
                            <Link href={`${housingPath}/${data.current_housing_id}`}>
                                View housing
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${beneficiaryPath}/${data.id}/edit`}>
                                <span className="flex items-center gap-2">
                                    <FaEdit className="text-xs" />
                                    Edit beneficiary
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove beneficiary
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <IoMdMove className="text-xs" />
                                Move to other housing
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {/* TODO: FORMAT */}
                        Created at {data.created_at}
                    </span>
                    <span>
                        <Badge>Active</Badge>
                    </span>
                </div>
            </div>

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
        </li>
    );
};

export { Card };
