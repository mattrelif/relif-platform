"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Toolbar = (): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    return (
        <div className="flex items-center gap-4">
            <Button asChild>
                <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                    <MdAdd size={16} />
                    Create beneficiary
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="icon" className="w-[40px] h-[40px] p-0">
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2">
                        <FaFileCsv />
                        Download CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2">
                        <FaFilePdf />
                        Download PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
