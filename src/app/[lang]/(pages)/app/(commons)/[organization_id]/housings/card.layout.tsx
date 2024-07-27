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
import { FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { MoveModal } from "./move.modal";
import { RemoveModal } from "./remove.modal";

const Card = (): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const [moveDialogOpenState, setMoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const housingId = 123456;

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">Abrigo Santo Agostino</span>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    1234 Elm Street, Apt 56B - Springfield, IL 62704 - United States
                </span>
                <div className="flex flex-col gap-2 mt-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        346 beneficiaries (84% occupied)
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                        <span>
                            <Badge className="bg-green-500 text-slate-50 hover:bg-green-600">
                                Available (25 available spaces)
                            </Badge>
                        </span>
                        <span>
                            <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-950">
                                Full
                            </Badge>
                        </span>
                        <span>
                            <Badge className="bg-red-600 text-slate-50 hover:bg-red-700">
                                Over crowded
                            </Badge>
                        </span>
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
                            <Link href={`${urlPath}/${housingId}`}>View housing</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${housingId}/edit`}>
                                <span className="flex items-center gap-2">
                                    <FaEdit className="text-xs" />
                                    Edit housing
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove housing
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        Created at Sep 14, 2022
                    </span>
                </div>
            </div>

            <RemoveModal
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />

            <MoveModal
                moveDialogOpenState={moveDialogOpenState}
                setMoveDialogOpenState={setMoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
