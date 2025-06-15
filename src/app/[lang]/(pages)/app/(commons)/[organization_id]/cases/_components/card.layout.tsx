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
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaCalendarAlt, FaEdit, FaFileAlt, FaStickyNote, FaTrash, FaUser, FaClock, FaDollarSign, FaEye } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import Link from "next/link";

type Props = CaseSchema & {
    refreshList: () => void;
};

const STATUS_COLORS = {
    OPEN: "bg-blue-100 text-blue-800 border-blue-200",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PENDING: "bg-orange-100 text-orange-800 border-orange-200",
    ON_HOLD: "bg-purple-100 text-purple-800 border-purple-200",
    CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
};

const PRIORITY_COLORS = {
    LOW: "bg-gray-100 text-gray-700 border-gray-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    URGENT: "bg-red-100 text-red-700 border-red-200",
};

const URGENCY_COLORS = {
    IMMEDIATE: "bg-red-100 text-red-700 border-red-200",
    WITHIN_WEEK: "bg-orange-100 text-orange-700 border-orange-200",
    WITHIN_MONTH: "bg-yellow-100 text-yellow-700 border-yellow-200",
    FLEXIBLE: "bg-green-100 text-green-700 border-green-200",
};



const Card = ({ data, refreshList }: { data: CaseSchema; refreshList: () => void }): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const platformRole = usePlatformRole();
    
    const casePath = pathname.split("/").slice(0, 5).join("/");
    const locale = pathname.split("/")[1] as string;

    const handleDropdownItemClick = (
        e: React.MouseEvent<HTMLDivElement>,
        route: string
    ) => {
        e.stopPropagation();
        router.push(route);
    };

    // Check if case is overdue - only for open/in-progress cases
    const isOverdue = data.due_date && 
        (data.status === "OPEN" || data.status === "IN_PROGRESS" || data.status === "PENDING") && 
        new Date() > new Date(data.due_date);

    return (
        <li className="w-full border-b border-slate-200 p-4 hover:bg-slate-50">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{data?.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-slate-500">{data?.case_number}</span>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{data?.beneficiary?.full_name}</span>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{convertToTitleCase(data?.case_type?.replace('_', ' '))}</span>
                    </div>

                    <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge 
                            variant="outline"
                            className={`text-xs ${STATUS_COLORS[data?.status as keyof typeof STATUS_COLORS] || 'text-slate-600'}`}
                        >
                            {convertToTitleCase(data?.status?.replace('_', ' '))}
                        </Badge>
                        <Badge 
                            variant="outline"
                            className={`text-xs ${PRIORITY_COLORS[data?.priority as keyof typeof PRIORITY_COLORS] || 'text-slate-600'}`}
                        >
                            {convertToTitleCase(data?.priority)}
                        </Badge>
                        {data?.urgency_level && (
                            <Badge 
                                variant="outline"
                                className={`text-xs ${URGENCY_COLORS[data?.urgency_level as keyof typeof URGENCY_COLORS] || 'text-slate-600'}`}
                            >
                                {convertToTitleCase(data?.urgency_level?.replace('_', ' '))}
                            </Badge>
                        )}
                        {isOverdue && (
                            <Badge variant="secondary" className="text-xs bg-red-500 text-white">
                                OVERDUE
                            </Badge>
                        )}
                    </div>

                    {/* Tags */}
                    {data?.tags && data.tags.length > 0 && (
                        <div className="flex gap-1 mb-3 flex-wrap">
                            {data.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                    #{tag}
                                </Badge>
                            ))}
                            {data.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                    +{data.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            <span>Due: {formatDate(data?.due_date || "", locale as "en" | "es" | "pt")}</span>
                        </div>
                        {data?.estimated_duration && (
                            <div className="flex items-center gap-1">
                                <FaClock className="text-xs" />
                                <span>{convertToTitleCase(data.estimated_duration.replace('_', ' '))}</span>
                            </div>
                        )}
                        {data?.budget_allocated && (
                            <div className="flex items-center gap-1">
                                <FaDollarSign className="text-xs" />
                                <span>{data.budget_allocated}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <FaStickyNote className="text-xs" />
                                {data?.notes_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <FaFileAlt className="text-xs" />
                                {data?.documents_count || 0}
                            </span>
                        </div>
                        <span className="ml-auto">Updated {formatDate(data?.updated_at || "", locale as "en" | "es" | "pt")}</span>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <SlOptions />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`${casePath}/${data?.id}`}>
                                <FaEye className="mr-2 h-4 w-4" />
                                View Case
                            </Link>
                        </DropdownMenuItem>
                        {platformRole === "ORG_ADMIN" && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href={`${casePath}/${data?.id}/edit`}>
                                        <FaEdit className="mr-2 h-4 w-4" />
                                        Edit Case
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <FaTrash className="mr-2 h-4 w-4" />
                                    Delete Case
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { Card }; 