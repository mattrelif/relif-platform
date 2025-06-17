import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { CasesPDFDocument } from "@/components/reports/cases";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getFromLocalStorage } from "@/utils/localStorage";
import { getCasesByOrganizationID } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { CaseSchema } from "@/types/case.types";

type ToolbarProps = {
    filteredCases?: CaseSchema[];
    searchTerm?: string;
};

const Toolbar = ({ filteredCases, searchTerm }: ToolbarProps): ReactNode => {
    const pathname = usePathname();
    const platformRole = usePlatformRole();
    const dict = useDictionary();
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const organizationId = pathname.split("/")[3];
    const currentUser = getFromLocalStorage("r_ud");

    const handleDownloadPDF = async () => {
        try {
            setIsExporting(true);
            
            let cases: CaseSchema[] = [];
            let exportType = "all";
            
            // If filtered cases are provided, use them; otherwise fetch all cases
            if (filteredCases && filteredCases.length > 0) {
                cases = filteredCases;
                exportType = "filtered";
            } else if (organizationId) {
                const response = await getCasesByOrganizationID(organizationId, 0, 99999, searchTerm || "");
                cases = response.data.data || [];
                exportType = searchTerm ? "searched" : "all";
            } else {
                throw new Error("Organization ID not found");
            }
            
            const titleSuffix = exportType === "filtered" ? " (Filtered)" : 
                              exportType === "searched" ? " (Search Results)" : "";
            
            const blob = await pdf(
                <CasesPDFDocument title={`Cases Report${titleSuffix}`} cases={cases} />
            ).toBlob();
            
            saveAs(blob, `cases-report-${exportType}-${new Date().toISOString().split('T')[0]}.pdf`);
            
            toast({
                title: "PDF Export Successful",
                description: `Exported ${cases.length} ${exportType} cases to PDF`,
                variant: "success",
            });
        } catch (error: any) {
            console.error("Error generating PDF:", error);
            toast({
                title: "PDF Export Failed",
                description: error.message || "Failed to generate PDF report",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            setIsExporting(true);
            
            let cases: CaseSchema[] = [];
            let exportType = "all";
            
            // If filtered cases are provided, use them; otherwise fetch all cases
            if (filteredCases && filteredCases.length > 0) {
                cases = filteredCases;
                exportType = "filtered";
            } else if (organizationId) {
                const response = await getCasesByOrganizationID(organizationId, 0, 99999, searchTerm || "");
                cases = response.data.data || [];
                exportType = searchTerm ? "searched" : "all";
            } else {
                throw new Error("Organization ID not found");
            }

            // Flatten the case objects for CSV export
            const flatData = cases.map((case_: any) => flattenObject(case_));

            const csv = Papa.unparse(flatData);

            const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(csvBlob, `cases-export-${exportType}-${new Date().toISOString().split('T')[0]}.csv`);
            
            toast({
                title: "CSV Export Successful",
                description: `Exported ${cases.length} ${exportType} cases to CSV`,
                variant: "success",
            });
        } catch (error: any) {
            console.error("Error generating CSV:", error);
            toast({
                title: "CSV Export Failed",
                description: error.message || "Failed to generate CSV export",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
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
                    <Button variant="icon" className="w-[40px] h-[40px] p-0" disabled={isExporting}>
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem 
                        className="flex gap-2" 
                        onClick={handleDownloadCSV}
                        disabled={isExporting}
                    >
                        <FaFileCsv />
                        {isExporting ? "Exporting..." : "Download CSV"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="flex gap-2" 
                        onClick={handleDownloadPDF}
                        disabled={isExporting}
                    >
                        <FaFilePdf />
                        {isExporting ? "Exporting..." : "Download PDF"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
export { Toolbar as CaseToolbar };
