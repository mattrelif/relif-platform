"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { RemoveModal } from "./remove.modal";

const Card = (): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const userID = 123456;

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">Anthony Silva</span>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <MdMail />
                    anthony@example.com
                </span>
                <div className="flex mt-2 gap-2">
                    <span>
                        <Badge className="bg-yellow-300 text-slate-900">Dentista</Badge>
                    </span>
                    <span>
                        <Badge className="bg-yellow-300 text-slate-900">Serviços Gerais</Badge>
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
                            <Link href={`${urlPath}/${userID}`}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View housing</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${userID}/edit`}>
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
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        Created at Sep 14, 2022
                    </span>
                    <span>
                        <Badge>Active</Badge>
                    </span>
                </div>
            </div>

            <RemoveModal
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
