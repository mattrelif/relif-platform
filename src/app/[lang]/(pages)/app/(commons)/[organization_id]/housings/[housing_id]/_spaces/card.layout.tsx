"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SpaceSchema } from "@/types/space.types";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { EditSpace } from "./edit.layout";
import { ViewSpace } from "./overview.layout";
import { RemoveSpaceModal } from "./remove.modal";

type Props = SpaceSchema & {
    refreshList: () => void;
};

const SpaceCard = ({ refreshList, ...data }: Props): ReactNode => {
    const [viewSheetOpenState, setViewSheetOpenState] = useState(false);
    const [editSheetOpenState, setEditSheetOpenState] = useState(false);
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const getStatus = () => {
        if (data.available_vacancies < 0) {
            return "SUPERCROWDED";
        } else if (data.total_vacancies > data.available_vacancies) {
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
        <li
            className={cn(
                "w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 border-l-[8px]",
                statusColor
            )}
        >
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data?.name}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        {data?.available_vacancies || 0}/{data.total_vacancies || 0} beds available
                    </span>
                    <span>
                        <Badge className={`${statusColor}`}>{status}</Badge>
                    </span>
                </div>
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
                space={data}
                sheetOpenState={viewSheetOpenState}
                setSheetOpenState={setViewSheetOpenState}
            />

            <EditSpace
                space={data}
                refreshList={refreshList}
                sheetOpenState={editSheetOpenState}
                setSheetOpenState={setEditSheetOpenState}
            />

            <RemoveSpaceModal
                space={data}
                refreshList={refreshList}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { SpaceCard };
