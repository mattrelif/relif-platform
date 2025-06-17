"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaEdit,
    FaFileAlt,
    FaStickyNote,
    FaUser,
    FaClock,
    FaDollarSign,
    FaFlag,
    FaTrash,
    FaTags,
    FaDownload,
    FaEye,
} from "react-icons/fa";
import {
    getCaseById,
    getCaseDocuments,
    generateCaseDocumentUploadLink,
    createCaseDocument,
    updateCaseDocument,
    deleteCaseDocument,
    extractFileKeyFromS3Url,
} from "@/repository/organization.repository";
import { CreateCaseDocumentPayload } from "@/types/case.types";
import { useToast } from "@/components/ui/use-toast";
import { DebugInfo } from "@/components/debug-info";

const CaseOverview = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const { toast } = useToast();
    const [caseData, setCaseData] = useState<CaseSchema | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        document_name: "",
        description: "",
        document_type: "",
        tags: [] as string[],
    });

    // Upload dialog state
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploadFormData, setUploadFormData] = useState<{
        document_name: string;
        document_type: string;
        description: string;
        tags: string[];
    }>({
        document_name: "",
        document_type: "OTHER",
        description: "",
        tags: [],
    });
    const [isUploading, setIsUploading] = useState(false);

    const caseId = pathname.split("/")[5];
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const handleDeleteDocument = (doc: any) => {
        setDocumentToDelete(doc);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteDocument = async () => {
        if (!documentToDelete) return;

        try {
            await deleteCaseDocument(caseId, documentToDelete.id);
            
            // Remove from local state
            setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
            
            toast({
                title: "Document Deleted",
                description: "The document has been deleted successfully.",
            });
        } catch (error: any) {
            console.error("Error deleting document:", error);
            
            // More specific error messages
            let errorMessage = "Error deleting document. Please try again.";
            if (error?.response?.status === 404) {
                errorMessage = "Document not found.";
            } else if (error?.response?.status === 403) {
                errorMessage = "You don't have permission to delete this document.";
            } else if (error?.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            }

            toast({
                title: "Delete Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }
    };

    const handleEditDocument = (doc: any) => {
        setDocumentToEdit(doc);
        setEditFormData({
            document_name: doc.document_name || "",
            description: doc.description || "",
            document_type: doc.document_type || "",
            tags: doc.tags || [],
        });
        setEditDialogOpen(true);
    };

    const confirmEditDocument = async () => {
        if (!documentToEdit) return;

        try {
            const updateData = {
                document_name: editFormData.document_name,
                description: editFormData.description,
                document_type: editFormData.document_type,
                tags: editFormData.tags,
            };

            await updateCaseDocument(caseId, documentToEdit.id, updateData);
            
            // Update local state
            setDocuments(prev => prev.map(doc => 
                doc.id === documentToEdit.id 
                    ? { ...doc, ...updateData }
                    : doc
            ));

            toast({
                title: "Document Updated",
                description: "The document has been updated successfully.",
            });

            setEditDialogOpen(false);
            setDocumentToEdit(null);
        } catch (error: any) {
            console.error("Error updating document:", error);
            
            toast({
                title: "Update Failed",
                description: "Error updating document. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleTagAdd = (tag: string) => {
        if (tag.trim() && !editFormData.tags.includes(tag.trim())) {
            setEditFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()],
            }));
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setEditFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleViewDocument = (doc: any) => {
        console.log("📄 Attempting to view document:", doc);
        
        if (doc.download_url && doc.download_url.trim() !== '') {
            // Open document in new tab for viewing
            console.log("🔗 Opening document URL:", doc.download_url);
            window.open(doc.download_url, '_blank');
        } else {
            console.error("❌ Document URL not available:", doc);
            toast({
                title: "View Failed",
                description: "Document URL not available. The document may still be processing.",
                variant: "destructive",
            });
        }
    };

    const handleDownloadDocument = async (doc: any) => {
        try {
            console.log("📥 Attempting to download document:", doc);
            
            if (doc.download_url && doc.download_url.trim() !== '') {
                console.log("🔗 Using download URL:", doc.download_url);
                
                // Create a temporary link element to trigger download
                const link = document.createElement('a');
                link.href = doc.download_url;
                link.download = doc.file_name || doc.document_name || 'document';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast({
                    title: "Download Started",
                    description: `Downloading ${doc.document_name || doc.file_name}...`,
                });
            } else {
                console.error("❌ Document URL not available:", doc);
                toast({
                    title: "Download Failed",
                    description: "Document URL not available. The document may still be processing.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("❌ Error downloading document:", error);
            toast({
                title: "Download Failed",
                description: "Error downloading document. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDownloadAllDocuments = async () => {
        try {
            if (!documents || documents.length === 0) {
                toast({
                    title: "No Documents",
                    description: "There are no documents to download.",
                    variant: "destructive",
                });
                return;
            }

            let downloadCount = 0;
            for (const doc of documents) {
                if (doc.download_url) {
                    try {
                        const link = document.createElement('a');
                        link.href = doc.download_url;
                        link.download = doc.file_name || doc.document_name || `document-${doc.id}`;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        downloadCount++;
                        
                        // Add small delay between downloads to avoid overwhelming the browser
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (docError) {
                        console.warn(`Failed to download document ${doc.document_name}:`, docError);
                    }
                }
            }

            toast({
                title: "Downloads Started",
                description: `Starting download of ${downloadCount} document(s)...`,
            });
        } catch (error: any) {
            console.error("Error downloading all documents:", error);
            toast({
                title: "Download Failed",
                description: "Error downloading documents. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUploadDocument = () => {
        // Create a file input element to trigger file selection
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt";
        input.onchange = e => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            if (files.length > 0) {
                setUploadFiles(files);
                setUploadFormData({
                    document_name: files[0].name.replace(/\.[^/.]+$/, ""), // Remove extension for default name
                    document_type: "OTHER",
                    description: "",
                    tags: [],
                });
                setUploadDialogOpen(true);
            }
        };
        input.click();
    };

    const handleUploadSubmit = async () => {
        if (uploadFiles.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of uploadFiles) {
                console.log(`📤 Starting upload for file: ${file.name}`);
                
                // Step 1: Get presigned upload URL
                console.log("🔗 Getting presigned upload URL...");
                const uploadLinkResponse = await generateCaseDocumentUploadLink(caseId, file.type);
                const uploadLinkData = uploadLinkResponse.data;
                console.log("✅ Got presigned URL:", uploadLinkData);

                // Step 2: Upload directly to S3
                console.log("☁️ Uploading to S3...");
                const s3Response = await fetch(uploadLinkData.link, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });

                if (!s3Response.ok) {
                    throw new Error(`S3 upload failed: ${s3Response.status} ${s3Response.statusText}`);
                }
                console.log("✅ S3 upload successful");

                // Step 3: Extract file key from S3 URL and save metadata
                console.log("💾 Saving document metadata...");
                const fileKey = extractFileKeyFromS3Url(uploadLinkData.link);
                
                const documentData = {
                    document_name: uploadFormData.document_name || file.name.replace(/\.[^/.]+$/, ""),
                    document_type: uploadFormData.document_type,
                    description: uploadFormData.description,
                    tags: uploadFormData.tags,
                    file_name: file.name,
                    file_size: file.size,
                    mime_type: file.type,
                    file_key: fileKey,
                };

                const createDocResponse = await createCaseDocument(caseId, documentData);
                console.log("✅ Document metadata saved:", createDocResponse);
                
                // Check if the response is actually successful even if it doesn't have expected format
                if (createDocResponse.status >= 200 && createDocResponse.status < 300) {
                    console.log("✅ Document creation confirmed successful");
                } else {
                    console.warn("⚠️ Unexpected response format:", createDocResponse);
                }
            }

            // Refresh documents list
            console.log("🔄 Refreshing documents list...");
            try {
                const documentsResult = await getCaseDocuments(caseId);
                const documentsData = documentsResult?.data;
                
                if (Array.isArray(documentsData)) {
                    setDocuments(documentsData);
                    console.log("✅ Documents list refreshed with", documentsData.length, "items");
                } else if (documentsData && typeof documentsData === 'object' && documentsData.data && Array.isArray(documentsData.data)) {
                    setDocuments(documentsData.data);
                    console.log("✅ Documents list refreshed from nested data with", documentsData.data.length, "items");
                } else {
                    console.warn("⚠️ Documents result is not an array:", documentsData);
                    setDocuments([]);
                }
            } catch (refreshError: any) {
                console.warn("⚠️ Could not refresh documents list:", refreshError.message);
                // Don't throw error here - document upload was successful, just refresh failed
            }

            // Reset form and close dialog
            setUploadFiles([]);
            setUploadFormData({
                document_name: "",
                document_type: "OTHER",
                description: "",
                tags: [],
            });
            setUploadDialogOpen(false);

            toast({
                title: "Success",
                description: `Successfully uploaded ${uploadFiles.length} document(s)!`,
            });
        } catch (error: any) {
            console.error("❌ Error uploading documents:", {
                error,
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });
            
            // More specific error messages
            let errorMessage = "Error uploading documents. Please try again.";
            if (error?.response?.status === 413) {
                errorMessage = "File is too large. Please choose a smaller file.";
            } else if (error?.response?.status === 415) {
                errorMessage = "File type not supported. Please choose a different file.";
            } else if (error?.message?.includes("S3 upload failed")) {
                errorMessage = "File upload to storage failed. Please try again.";
            } else if (error?.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            }

            toast({
                title: "Upload Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadTagAdd = (tag: string) => {
        if (tag.trim() && !uploadFormData.tags.includes(tag.trim())) {
            setUploadFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()],
            }));
        }
    };

    const handleUploadTagRemove = (tagToRemove: string) => {
        setUploadFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getMimeTypeLabel = (mimeType: string): string => {
        if (!mimeType) return 'File';
        
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'DOC';
        if (mimeType.includes('image')) return 'Image';
        if (mimeType.includes('text')) return 'Text';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Excel';
        
        return mimeType.split('/')[1]?.toUpperCase() || 'File';
    };

    const getServiceTypeLabel = (serviceType: string): string => {
        const serviceTypeMap: { [key: string]: string } = {
            'CHILD_PROTECTION_CASE_MANAGEMENT': 'Child Protection Case Management',
            'GBV_CASE_MANAGEMENT': 'Gender-Based Violence (GBV) Case Management',
            'GENERAL_PROTECTION_SERVICES': 'General Protection Services',
            'SEXUAL_VIOLENCE_RESPONSE': 'Sexual Violence Response',
            'INTIMATE_PARTNER_VIOLENCE_SUPPORT': 'Intimate Partner Violence Support',
            'HUMAN_TRAFFICKING_RESPONSE': 'Human Trafficking Response',
            'FAMILY_SEPARATION_REUNIFICATION': 'Family Separation and Reunification',
            'UASC_SERVICES': 'Unaccompanied and Separated Children (UASC) Services',
            'MHPSS': 'Mental Health and Psychosocial Support (MHPSS)',
            'LEGAL_AID_ASSISTANCE': 'Legal Aid and Assistance',
            'CIVIL_DOCUMENTATION_SUPPORT': 'Civil Documentation Support',
            'EMERGENCY_SHELTER_HOUSING': 'Emergency Shelter and Housing',
            'NFI_DISTRIBUTION': 'Non-Food Items (NFI) Distribution',
            'FOOD_SECURITY_NUTRITION': 'Food Security and Nutrition',
            'CVA': 'Cash and Voucher Assistance (CVA)',
            'WASH': 'Water, Sanitation and Hygiene (WASH)',
            'HEALTHCARE_SERVICES': 'Healthcare Services',
            'EMERGENCY_MEDICAL_CARE': 'Emergency Medical Care',
            'SEXUAL_REPRODUCTIVE_HEALTH': 'Sexual and Reproductive Health Services',
            'DISABILITY_SUPPORT_SERVICES': 'Disability Support Services',
            'EMERGENCY_EVACUATION': 'Emergency Evacuation',
            'SEARCH_RESCUE_COORDINATION': 'Search and Rescue Coordination',
            'RAPID_ASSESSMENT_NEEDS_ANALYSIS': 'Rapid Assessment and Needs Analysis',
            'EMERGENCY_REGISTRATION': 'Emergency Registration',
            'EMERGENCY_TRANSPORTATION': 'Emergency Transportation',
            'EMERGENCY_COMMUNICATION_SERVICES': 'Emergency Communication Services',
            'EMERGENCY_EDUCATION_SERVICES': 'Emergency Education Services',
            'CHILD_FRIENDLY_SPACES': 'Child-Friendly Spaces',
            'SKILLS_TRAINING_VOCATIONAL_EDUCATION': 'Skills Training and Vocational Education',
            'LITERACY_PROGRAMS': 'Literacy Programs',
            'AWARENESS_PREVENTION_CAMPAIGNS': 'Awareness and Prevention Campaigns',
            'LIVELIHOOD_SUPPORT_PROGRAMS': 'Livelihood Support Programs',
            'MICROFINANCE_CREDIT_SERVICES': 'Microfinance and Credit Services',
            'JOB_PLACEMENT_EMPLOYMENT_SERVICES': 'Job Placement and Employment Services',
            'AGRICULTURAL_SUPPORT': 'Agricultural Support',
            'BUSINESS_DEVELOPMENT_SUPPORT': 'Business Development Support',
            'REFUGEE_SERVICES': 'Refugee Services',
            'IDP_SERVICES': 'Internally Displaced Person (IDP) Services',
            'RETURNEE_REINTEGRATION_SERVICES': 'Returnee and Reintegration Services',
            'HOST_COMMUNITY_SUPPORT': 'Host Community Support',
            'ELDERLY_CARE_SERVICES': 'Elderly Care Services',
            'SERVICES_FOR_PERSONS_WITH_DISABILITIES': 'Services for Persons with Disabilities',
            'CASE_REFERRAL_TRANSFER': 'Case Referral and Transfer',
            'INTER_AGENCY_COORDINATION': 'Inter-agency Coordination',
            'SERVICE_MAPPING_INFORMATION': 'Service Mapping and Information',
            'FOLLOW_UP_MONITORING': 'Follow-up and Monitoring',
            'CASE_CLOSURE_TRANSITION': 'Case Closure and Transition',
            'BIRTH_REGISTRATION': 'Birth Registration',
            'IDENTITY_DOCUMENTATION': 'Identity Documentation',
            'LEGAL_COUNSELING': 'Legal Counseling',
            'COURT_SUPPORT_ACCOMPANIMENT': 'Court Support and Accompaniment',
            'DETENTION_MONITORING': 'Detention Monitoring',
            'ADVOCACY_SERVICES': 'Advocacy Services',
            'PRIMARY_HEALTHCARE': 'Primary Healthcare',
            'CLINICAL_MANAGEMENT_RAPE': 'Clinical Management of Rape (CMR)',
            'HIV_AIDS_PREVENTION_TREATMENT': 'HIV/AIDS Prevention and Treatment',
            'TUBERCULOSIS_TREATMENT': 'Tuberculosis Treatment',
            'MALNUTRITION_TREATMENT': 'Malnutrition Treatment',
            'VACCINATION_PROGRAMS': 'Vaccination Programs',
            'EMERGENCY_SURGERY': 'Emergency Surgery',
            'CAMP_COORDINATION_MANAGEMENT': 'Camp Coordination and Camp Management',
            'MINE_ACTION_SERVICES': 'Mine Action Services',
            'PEACEKEEPING_PEACEBUILDING': 'Peacekeeping and Peacebuilding',
            'LOGISTICS_TELECOMMUNICATIONS': 'Logistics and Telecommunications',
            'INFORMATION_MANAGEMENT': 'Information Management',
            'COMMUNITY_MOBILIZATION': 'Community Mobilization',
            'WINTERIZATION_SUPPORT': 'Winterization Support'
        };
        return serviceTypeMap[serviceType] || serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getDocumentTypeLabel = (documentType: string): string => {
        const documentTypeMap: { [key: string]: string } = {
            'FORM': 'Form',
            'REPORT': 'Report',
            'EVIDENCE': 'Evidence',
            'CORRESPONDENCE': 'Correspondence',
            'IDENTIFICATION': 'Identification',
            'LEGAL': 'Legal Document',
            'MEDICAL': 'Medical Document',
            'OTHER': 'Other'
        };
        
        return documentTypeMap[documentType] || convertToTitleCase(documentType);
    };

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch case data
                console.log("🔍 Fetching case data for ID:", caseId);
                const caseResult = await getCaseById(caseId);
                setCaseData(caseResult.data);
                console.log("✅ Case data loaded:", caseResult.data);

                // Fetch documents
                console.log("📄 Fetching documents for case:", caseId);
                const documentsResult = await getCaseDocuments(caseId);
                const documentsData = documentsResult?.data;
                
                console.log("📄 Raw documents response:", documentsData);
                
                if (Array.isArray(documentsData)) {
                    setDocuments(documentsData);
                    console.log("✅ Documents loaded directly as array with", documentsData.length, "items");
                } else if (documentsData && typeof documentsData === 'object' && documentsData.data && Array.isArray(documentsData.data)) {
                    setDocuments(documentsData.data);
                    console.log("✅ Documents loaded from nested data with", documentsData.data.length, "items");
                } else {
                    console.warn("⚠️ Documents result is not an array:", documentsData);
                    setDocuments([]);
                }
            } catch (err: any) {
                console.error("❌ Error fetching case data:", {
                    error: err.message,
                    status: err?.response?.status,
                    data: err?.response?.data,
                    caseId
                });
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (caseId) {
            fetchCaseData();
        }
    }, [caseId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-relif-orange-400">Loading case information...</div>
            </div>
        );
    }

    if (error || !caseData) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-red-600">Error loading case information</div>
            </div>
        );
    }

    return (
        <div className="w-full h-max flex flex-col gap-4">
            {/* Case Header Card */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-6 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Case #{caseData.case_number}
                        </h1>
                        <p className="text-slate-600 text-sm">{caseData.title}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge 
                            className={`${
                                caseData.priority === "HIGH" 
                                    ? "bg-red-100 text-red-800 hover:bg-red-200" 
                                    : caseData.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                            } px-3 py-1 font-medium`}
                        >
                            {convertToTitleCase(caseData.priority)} Priority
                        </Badge>
                        <Badge 
                            className={`${
                                caseData.status === "IN_PROGRESS" 
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
                                    : caseData.status === "CLOSED"
                                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    : caseData.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                    : caseData.status === "ON_HOLD"
                                    ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                            } px-3 py-1 font-medium`}
                        >
                            {convertToTitleCase(caseData.status.replace('_', ' '))}
                        </Badge>
                        <Link href={`${pathname}/edit`}>
                            <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white font-medium">
                                <FaEdit className="w-4 h-4 mr-2" />
                                Edit Case
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Case Information Card */}
                <div className="lg:col-span-2 w-full h-max border-[1px] border-slate-200 rounded-lg p-6 bg-white">
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold text-lg flex items-center gap-2">
                            <FaUser className="text-lg" />
                            Case Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Title</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900">{caseData.title}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Beneficiary</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900 font-medium">{caseData.beneficiary.full_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Service Types</label>
                                <div className="p-3 bg-slate-50 rounded-lg border min-h-[44px] flex items-center">
                                    {caseData.service_types && caseData.service_types.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {caseData.service_types.map((serviceType: string, index: number) => (
                                                <Badge key={index} variant="outline" className="text-xs font-medium">
                                                    {getServiceTypeLabel(serviceType)}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500">No service types assigned</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Case Worker</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900">{caseData.assigned_to ? `${caseData.assigned_to.first_name} ${caseData.assigned_to.last_name}` : 'Unassigned'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Created Date</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900 flex items-center gap-2">
                                        <FaCalendarAlt className="w-4 h-4 text-relif-orange-200" />
                                        {formatDate(caseData.created_at, locale)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Last Updated</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900 flex items-center gap-2">
                                        <FaClock className="w-4 h-4 text-relif-orange-200" />
                                        {formatDate(caseData.updated_at, locale)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {caseData.description && (
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <div className="p-4 bg-slate-50 rounded-lg border">
                                    <p className="text-sm text-slate-900 leading-relaxed">{caseData.description}</p>
                                </div>
                            </div>
                        )}

                        {caseData.tags && caseData.tags.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">Tags</label>
                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex flex-wrap gap-2">
                                        {caseData.tags.map((tag: string, index: number) => (
                                            <Badge key={index} className="bg-relif-orange-100 text-relif-orange-800 hover:bg-relif-orange-200 text-xs font-medium">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Case Activity Card */}
                <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-6 bg-white">
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold text-lg flex items-center gap-2">
                            <FaStickyNote className="text-lg" />
                            Case Activity
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <FaStickyNote className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Updates</span>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 font-bold">
                                    {caseData.notes_count || 0}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <FaFileAlt className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-slate-700">Documents</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 font-bold">
                                    {caseData.documents_count || 0}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Section Card */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-6 bg-white">
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <h2 className="text-relif-orange-200 font-bold text-lg flex items-center gap-2">
                            <FaFileAlt className="text-lg" />
                            Case Documents ({Array.isArray(documents) ? documents.length : 0})
                        </h2>
                        {Array.isArray(documents) && documents.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white font-medium"
                                    onClick={handleUploadDocument}
                                >
                                    <FaFileAlt className="w-4 h-4 mr-2" />
                                    Add More Documents
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-200 text-green-700 hover:bg-green-50 font-medium"
                                    onClick={handleDownloadAllDocuments}
                                >
                                    <FaDownload className="w-4 h-4 mr-2" />
                                    Download All
                                </Button>
                            </div>
                        )}
                    </div>

                    {!Array.isArray(documents) || documents.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <FaFileAlt className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-600 mb-2">No documents uploaded yet</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Upload your first document to get started with case documentation.
                            </p>
                            <Button
                                size="default"
                                variant="outline"
                                className="border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2"
                                onClick={handleUploadDocument}
                            >
                                <FaFileAlt className="w-4 h-4 mr-2" />
                                Add First Document
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className="border border-slate-200 bg-white rounded-lg p-4 hover:border-relif-orange-200 hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h4 className="font-semibold text-base text-slate-900">
                                                    {doc.document_name}
                                                </h4>
                                                <Badge variant="outline" className="text-xs font-medium">
                                                    {getDocumentTypeLabel(doc.document_type || 'OTHER')}
                                                </Badge>

                                            </div>

                                            {doc.description && (
                                                <p className="text-sm text-slate-600 mb-3">
                                                    {doc.description}
                                                </p>
                                            )}

                                            {doc.tags && doc.tags.length > 0 && (
                                                <div className="flex gap-1 mb-3 flex-wrap">
                                                    {doc.tags.map((tag: string, index: number) => (
                                                        <Badge
                                                            key={`doc-${doc.id}-tag-${index}`}
                                                            className="bg-relif-orange-100 text-relif-orange-800 text-xs"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="font-medium">
                                                    {getMimeTypeLabel(doc.mime_type)} • {formatFileSize(doc.file_size)}
                                                </span>
                                                <span>By {doc.uploaded_by?.name || 'Unknown User'}</span>
                                                <span>{formatDate(doc.created_at, locale)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                size="sm"
                                                className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                                                onClick={() => handleViewDocument(doc)}
                                            >
                                                <FaEye className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white"
                                                onClick={() => handleDownloadDocument(doc)}
                                            >
                                                <FaDownload className="w-3 h-3 mr-1" />
                                                Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-xs px-3 py-1 bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                                                onClick={() => handleEditDocument(doc)}
                                            >
                                                <FaEdit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() => handleDeleteDocument(doc)}
                                            >
                                                <FaTrash className="w-3 h-3 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{documentToDelete?.document_name}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteDocument}>
                            Delete Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Document Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="pb-3">Edit Document</DialogTitle>
                        <DialogDescription>
                            Update the document information below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full h-max flex flex-col gap-6">
                        {/* Document Details Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaFileAlt />
                                Document Details
                            </h2>

                            <div className="w-full flex items-center gap-2">
                                {/* Document Name */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="document_name">Document Name</Label>
                                    <Input
                                        id="document_name"
                                        placeholder="Enter document name"
                                        value={editFormData.document_name}
                                        onChange={e =>
                                            setEditFormData(prev => ({
                                                ...prev,
                                                document_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                {/* Document Type */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="document_type">Document Type</Label>
                                    <Select
                                        value={editFormData.document_type}
                                        onValueChange={value =>
                                            setEditFormData(prev => ({
                                                ...prev,
                                                document_type: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Application Form">
                                                Application Form
                                            </SelectItem>
                                            <SelectItem value="Verification Letter">
                                                Verification Letter
                                            </SelectItem>
                                            <SelectItem value="Background Check">
                                                Background Check
                                            </SelectItem>
                                            <SelectItem value="Medical Records">
                                                Medical Records
                                            </SelectItem>
                                            <SelectItem value="Reference Letter">
                                                Reference Letter
                                            </SelectItem>
                                            <SelectItem value="Legal Document">
                                                Legal Document
                                            </SelectItem>
                                            <SelectItem value="Financial Document">
                                                Financial Document
                                            </SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter document description"
                                    value={editFormData.description}
                                    onChange={e =>
                                        setEditFormData(prev => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Tags & Status Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaTags />
                                Tags
                            </h2>

                            {/* Tags */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="tags">Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editFormData.tags.map((tag, index) => (
                                        <Badge
                                            key={`edit-tag-${index}`}
                                            className="bg-relif-orange-500 text-xs flex items-center gap-1"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleTagRemove(tag)}
                                                className="ml-1 text-xs hover:text-red-200"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    id="tags"
                                    placeholder="Add a tag and press Enter"
                                    onKeyPress={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleTagAdd(e.currentTarget.value);
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            </div>


                        </div>
                    </div>

                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmEditDocument}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upload Document Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="pb-3">Upload Document</DialogTitle>
                        <DialogDescription>
                            Categorize and upload your document(s) to this case.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full h-max flex flex-col gap-6">
                        {/* Selected Files */}
                        <div className="w-full h-max flex flex-col gap-3 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaFileAlt />
                                Selected Files ({uploadFiles.length})
                            </h2>
                            {uploadFiles.map((file, index) => (
                                <div key={`upload-file-${index}`} className="text-sm text-slate-600">
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                            ))}
                        </div>

                        {/* Document Details */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaFileAlt />
                                Document Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Document Name */}
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="upload_document_name">Document Name</Label>
                                    <Input
                                        id="upload_document_name"
                                        placeholder="Enter document name"
                                        value={uploadFormData.document_name}
                                        onChange={e =>
                                            setUploadFormData(prev => ({
                                                ...prev,
                                                document_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                {/* Document Type */}
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="upload_document_type">Document Type</Label>
                                    <Select
                                        value={uploadFormData.document_type}
                                        onValueChange={value =>
                                            setUploadFormData(prev => ({
                                                ...prev,
                                                document_type: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FORM">Form</SelectItem>
                                            <SelectItem value="REPORT">Report</SelectItem>
                                            <SelectItem value="EVIDENCE">Evidence</SelectItem>
                                            <SelectItem value="CORRESPONDENCE">
                                                Correspondence
                                            </SelectItem>
                                            <SelectItem value="IDENTIFICATION">
                                                Identification
                                            </SelectItem>
                                            <SelectItem value="LEGAL">Legal Document</SelectItem>
                                            <SelectItem value="MEDICAL">
                                                Medical Document
                                            </SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="upload_description">Description</Label>
                                <Textarea
                                    id="upload_description"
                                    placeholder="Brief description of the document"
                                    value={uploadFormData.description}
                                    onChange={e =>
                                        setUploadFormData(prev => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="upload_tags">Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {uploadFormData.tags.map((tag, index) => (
                                        <Badge
                                            key={`upload-tag-${index}`}
                                            className="bg-relif-orange-500 text-xs flex items-center gap-1"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleUploadTagRemove(tag)}
                                                className="ml-1 text-xs hover:text-red-200"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    id="upload_tags"
                                    placeholder="Add a tag and press Enter (e.g. important, legal, housing)"
                                    onKeyPress={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleUploadTagAdd(e.currentTarget.value);
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-5">
                        <Button
                            variant="outline"
                            onClick={() => setUploadDialogOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadSubmit}
                            disabled={isUploading || !uploadFormData.document_name.trim()}
                        >
                            {isUploading
                                ? "Uploading..."
                                : `Upload ${uploadFiles.length} Document(s)`}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { CaseOverview };
