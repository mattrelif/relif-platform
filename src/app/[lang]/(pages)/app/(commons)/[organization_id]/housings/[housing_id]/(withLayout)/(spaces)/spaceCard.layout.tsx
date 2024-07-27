"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { EditSpace } from "./editSpace.layout";
import { RemoveSpaceModal } from "./removeSpace.modal";
import { ViewSpace } from "./viewSpace.layout";

type Props = {
    status: "available" | "full" | "overCrowded";
};

const SpaceCard = ({ status }: Props): ReactNode => {
    const [viewSheetOpenState, setViewSheetOpenState] = useState(false);
    const [editSheetOpenState, setEditSheetOpenState] = useState(false);
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const statusColor =
        status === "available"
            ? "border-l-green-500"
            : status === "full"
              ? "border-l-red-600"
              : "border-l-slate-900";

    return (
        <li
            className={cn(
                "w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 border-l-[8px]",
                statusColor
            )}
        >
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">QUARTO-02</span>
                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    2/5 beds available
                </span>
            </div>
            <div className="flex items-start">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setViewSheetOpenState(true)}>
                            View space
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditSheetOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaEdit className="text-xs" />
                                Edit
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ViewSpace
                sheetOpenState={viewSheetOpenState}
                setSheetOpenState={setViewSheetOpenState}
            />

            <EditSpace
                sheetOpenState={editSheetOpenState}
                setSheetOpenState={setEditSheetOpenState}
            />

            <RemoveSpaceModal
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { SpaceCard };
