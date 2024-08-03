"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationSchema } from "@/types/organization.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { DisableModal } from "./disable.modal";

type Props = OrganizationSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data.name}</span>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {`${data?.address.street_name}, ${data?.address.street_number} - ${data?.address.city}, ${data?.address.district} | ${data?.address.zip_code} - ${data?.address.country}`}
                </span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {/* TODO: BACKEND */}
                        <FaUsers /> 6 users
                    </span>
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {/* TODO: BACKEND */}
                        <FaHouseChimneyUser /> 8 housings
                    </span>
                </div>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {/* TODO: CREATOR NAME */}
                    {data.creator_id}
                </span>
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
                            <Link href={`/app/admin/organizations/${data.id}`}>
                                View organization
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="#">
                                <span className="flex items-center gap-2">
                                    <FaEdit className="text-xs" />
                                    Disable access
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {/* TODO: FORMAT */}
                        Created at {data.created_at}
                    </span>
                </div>
            </div>

            <DisableModal
                refreshList={refreshList}
                organization={data}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
