"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VoluntarySchema } from "@/types/voluntary.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdMail } from "react-icons/md";

import { RemoveModal } from "./remove.modal";

type Props = VoluntarySchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...voluntary }: Props): ReactNode => {
    const dict = useDictionary();
    const router = useRouter();
    const platformRole = usePlatformRole();
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const handleViewProfileClick = (e: any) => {
        e.stopPropagation();
        router.push(`${urlPath}/${voluntary?.id}`);
    };

    const handleEditClick = (e: any) => {
        e.stopPropagation();
        router.push(`${urlPath}/${voluntary?.id}/edit`);
    };

    const handleRemoveClick = (e: any) => {
        e.stopPropagation();
        setRemoveDialogOpenState(true);
    };

    return (
        <>
            <li
                className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4"
                onClick={() => router.push(`${urlPath}/${voluntary?.id}`)}
            >
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">{voluntary?.full_name}</span>
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <MdMail />
                        {voluntary?.email}
                    </span>
                    <div className="flex mt-2 gap-2 flex-wrap">
                        {voluntary?.segments.map((segment, index) => (
                            <Badge key={index} className="bg-yellow-300 text-slate-900">{segment}</Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="sm"
                                        variant="icon"
                                        className="w-8 h-8 p-0 flex items-center justify-center"
                                        onClick={handleViewProfileClick}
                                    >
                                        <FaEye />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{dict.commons.volunteers.list.card.profile}</TooltipContent>
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
                                                className="w-8 h-8 p-0 flex items-center justify-center"
                                                onClick={handleEditClick}
                                            >
                                                <FaEdit />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{dict.commons.volunteers.list.card.editVoluntary}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button
                                                size="sm"
                                                variant="icon"
                                                className="w-8 h-8 p-0 flex items-center justify-center"
                                                onClick={handleRemoveClick}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{dict.commons.volunteers.list.card.removeVoluntary}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-end lg:hidden">
                        <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            {dict.commons.volunteers.list.card.createdAt}{" "}
                            {formatDate(voluntary?.created_at, locale || "en")}
                        </span>
                    </div>
                </div>
            </li>

            {platformRole === "ORG_ADMIN" && (
                <RemoveModal
                    volunteer={voluntary}
                    refreshList={refreshList}
                    removeDialogOpenState={removeDialogOpenState}
                    setRemoveDialogOpenState={setRemoveDialogOpenState}
                />
            )}
        </>
    );
};

export { Card };
