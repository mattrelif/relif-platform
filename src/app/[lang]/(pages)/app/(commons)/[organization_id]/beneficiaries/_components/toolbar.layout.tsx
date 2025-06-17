import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { PDFDocument } from "@/components/reports/beneficiaries";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { getFromLocalStorage } from "@/utils/localStorage";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Papa from "papaparse";
import { ReactNode, useState } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { BeneficiarySchema } from "@/types/beneficiary.types";

type ToolbarProps = {
    filteredBeneficiaries?: BeneficiarySchema[];
    searchTerm?: string;
};

const Toolbar = ({ filteredBeneficiaries, searchTerm }: ToolbarProps): ReactNode => {
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
            
            let beneficiaries: BeneficiarySchema[] = [];
            let exportType = "all";
            
            // If filtered beneficiaries are provided, use them; otherwise fetch all beneficiaries
            if (filteredBeneficiaries && filteredBeneficiaries.length > 0) {
                beneficiaries = filteredBeneficiaries;
                exportType = "filtered";
            } else if (organizationId) {
                const response = await getBeneficiariesByOrganizationID(organizationId, 0, 99999, searchTerm || "");
                beneficiaries = response.data.data || [];
                exportType = searchTerm ? "searched" : "all";
            } else {
                throw new Error("Organization ID not found");
            }
            
            const titleSuffix = exportType === "filtered" ? " (Filtered)" : 
                              exportType === "searched" ? " (Search Results)" : "";
            
            const blob = await pdf(
                <PDFDocument title={`Beneficiaries Report${titleSuffix}`} beneficiaries={beneficiaries} />
            ).toBlob();
            
            saveAs(blob, `beneficiaries-report-${exportType}-${new Date().toISOString().split('T')[0]}.pdf`);
            
            toast({
                title: "PDF Export Successful",
                description: `Exported ${beneficiaries.length} ${exportType} beneficiaries to PDF`,
                variant: "success",
            });
        } catch (error: any) {
            console.error(dict.commons.beneficiaries.toolbar.errorGeneratingPDF, error);
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
            
            let beneficiaries: BeneficiarySchema[] = [];
            let exportType = "all";
            
            // If filtered beneficiaries are provided, use them; otherwise fetch all beneficiaries
            if (filteredBeneficiaries && filteredBeneficiaries.length > 0) {
                beneficiaries = filteredBeneficiaries;
                exportType = "filtered";
            } else if (organizationId) {
                const response = await getBeneficiariesByOrganizationID(organizationId, 0, 99999, searchTerm || "");
                beneficiaries = response.data.data || [];
                exportType = searchTerm ? "searched" : "all";
            } else {
                throw new Error("Organization ID not found");
            }

            const flatData = beneficiaries.map((beneficiary: any) =>
                flattenObject(beneficiary)
            );

            const csv = Papa.unparse(flatData);

            const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(csvBlob, `beneficiaries-export-${exportType}-${new Date().toISOString().split('T')[0]}.csv`);
            
            toast({
                title: "CSV Export Successful",
                description: `Exported ${beneficiaries.length} ${exportType} beneficiaries to CSV`,
                variant: "success",
            });
        } catch (error: any) {
            console.error(dict.commons.beneficiaries.toolbar.errorGeneratingCSV, error);
            toast({
                title: "CSV Export Failed",
                description: error.message || "Failed to generate CSV export",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const isMyOrganization = currentUser?.organization_id === organizationId;

    return (
        <div className="flex flex-wrap items-center gap-4">
            {platformRole === "ORG_ADMIN" && isMyOrganization && (
                <Button asChild className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                    <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.commons.beneficiaries.toolbar.createBeneficiary}
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
                        {isExporting ? "Exporting..." : dict.commons.beneficiaries.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="flex gap-2" 
                        onClick={handleDownloadPDF}
                        disabled={isExporting}
                    >
                        <FaFilePdf />
                        {isExporting ? "Exporting..." : dict.commons.beneficiaries.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
