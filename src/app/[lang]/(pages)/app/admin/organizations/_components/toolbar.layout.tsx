"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
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
    const dict = useDictionary();

    return (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="icon"
                        className="w-max h-[40px] p-0 flex items-center gap-3 px-5"
                    >
                        {dict.admin.organizations.list.toolbar.reports}
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2">
                        <FaFileCsv />
                        {dict.admin.organizations.list.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2">
                        <FaFilePdf />
                        {dict.admin.organizations.list.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
