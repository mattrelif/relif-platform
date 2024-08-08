"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { PDFDocument } from "@/components/reports/housings";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Toolbar = ({ organizationId }: { organizationId: string }): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const handleDownloadPDF = async () => {
        try {
            const response = await findHousingsByOrganizationId(organizationId, 0, 99999, "");
            const blob = await pdf(
                <PDFDocument title="Housings" housings={response.data.data} />
            ).toBlob();
            saveAs(blob, "housings.pdf");
        } catch {
            console.error("Error generating PDF");
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button asChild>
                <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                    <MdAdd size={16} />
                    {dict.housingList.btnCreate}
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
                        {dict.housingList.downloadCsv}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        {dict.housingList.downloadPdf}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
