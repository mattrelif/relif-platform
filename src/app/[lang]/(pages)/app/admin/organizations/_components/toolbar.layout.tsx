"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";

const Toolbar = (): ReactNode => {
    return (
        <div className="flex items-center gap-4">
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
