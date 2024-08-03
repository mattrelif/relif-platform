"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { DisableModal } from "./disable.modal";

type Props = UpdateOrganizationTypeRequestSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const [disableDialogOpenState, setDisableDialogOpenState] = useState(false);

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data.organization_id}</span>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <FaUser />
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
                request={data}
                removeDialogOpenState={disableDialogOpenState}
                setRemoveDialogOpenState={setDisableDialogOpenState}
            />
        </li>
    );
};

export { Card };
