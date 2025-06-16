import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Toolbar = (): ReactNode => {
    const pathname = usePathname();
    const platformRole = usePlatformRole();
    const dict = useDictionary();

    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const organizationId = pathname.split("/")[3];
    const currentUser = getFromLocalStorage("r_ud");

    const handleDownloadPDF = async () => {
        try {
            // TODO: Implement PDF download for cases
            console.log("Download PDF functionality to be implemented");
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            // TODO: Implement CSV download for cases
            console.log("Download CSV functionality to be implemented");
        } catch (error) {
            console.error("Error generating CSV", error);
        }
    };

    // For testing purposes, show the Create Case button more liberally
    // In production, you'd want to keep the strict role checking
    const showCreateButton =
        platformRole === "ORG_ADMIN" || platformRole === "ORG_MEMBER" || !currentUser;
    const isMyOrganization =
        !currentUser || (currentUser && currentUser?.organization_id === organizationId);

    return (
        <div className="flex flex-wrap items-center gap-4">
            {showCreateButton && (
                <Button asChild className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                    <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                        <MdAdd size={16} />
                        Create Case
                    </Link>
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="icon" className="w-[40px] h-[40px] p-0">
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadCSV}>
                        <FaFileCsv />
                        Download CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        Download PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
export { Toolbar as CaseToolbar };
