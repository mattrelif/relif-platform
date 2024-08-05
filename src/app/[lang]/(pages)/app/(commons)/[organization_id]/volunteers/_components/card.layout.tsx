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
import { VoluntarySchema } from "@/types/voluntary.types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { RemoveModal } from "./remove.modal";

type Props = VoluntarySchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...voluntary }: Props): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{voluntary?.full_name}</span>
                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <MdMail />
                    {voluntary?.email}
                </span>
                <div className="flex mt-2 gap-2">
                    {voluntary?.segments.map(segment => (
                        <span>
                            <Badge className="bg-yellow-300 text-slate-900">{segment}</Badge>
                        </span>
                    ))}
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
                            <Link href={`${urlPath}/${voluntary?.id}`}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${voluntary?.id}/edit`}>
                                <span className="flex items-center gap-2">
                                    <FaEdit className="text-xs" />
                                    Edit voluntary
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove voluntary
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        Created at {formatDate(voluntary?.created_at, locale || "en")}
                    </span>
                </div>
            </div>

            <RemoveModal
                volunteer={voluntary}
                refreshList={refreshList}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
