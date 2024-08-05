"use client";

import { BeneficiaryAllocationSchema } from "@/types/beneficiary.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";

const Card = (data: BeneficiaryAllocationSchema): ReactNode => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    return (
        <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
            <span className="text-sm text-slate-900 flex items-center gap-2">
                {formatDate(data.created_at, locale || "en")}
            </span>
            <span className="text-sm text-slate-900">
                <strong>From:</strong> {data.old_housing_id} ({data.old_room_id})
            </span>
            <span className="text-sm text-slate-900">
                <strong>To:</strong> {data.housing_id} ({data.room_id})
            </span>
            <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                <FaInfoCircle />
                Reason
            </span>
            <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                {data.exit_reason}
            </span>
        </li>
    );
};

export { Card };
