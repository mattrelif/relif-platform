"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "@/components/ui/document-viewer";
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { getServiceTypeLabel } from "@/utils/serviceTypeLabels";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useRef } from "react";
import {
    FaCalendarAlt,
    FaEdit,
    FaFileAlt,
    FaStickyNote,
    FaUser,
    FaClock,
    FaFlag,
    FaDownload,
    FaEye,
    FaUserCheck,
    FaUserShield,
    FaIdCard,
    FaPlus,
    FaExclamationTriangle,
    FaComments,
    FaLock,
    FaUnlock,
    FaCheck,
    FaTrash,
} from "react-icons/fa";
import {
    getCaseById,
    getCaseDocuments,
    updateCaseDocument,
    deleteCaseDocument,
    generateCaseDocumentUploadLink,
    createCaseDocument,
} from "@/repository/organization.repository";
import { CaseTimeline } from "./timeline.layout";

const Content = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const [caseData, setCaseData] = useState<CaseSchema | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isOperationLoading, setIsOperationLoading] = useState(false);
    const [editingDocument, setEditingDocument] = useState<any | null>(null);
    const [viewingDocument, setViewingDocument] = useState<any | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [editFormData, setEditFormData] = useState({
        document_name: '',
        document_type: '',
        description: '',
        tags: ''
    });
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [timelineEventCount, setTimelineEventCount] = useState(1);

    const caseId = pathname.split("/")[5];
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getMimeTypeLabel = (mimeType: string): string => {
        const mimeMap: { [key: string]: string } = {
            "application/pdf": "PDF",
            "image/jpeg": "JPEG Image",
            "image/png": "PNG Image",
            "application/msword": "Word Document",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document",
        };
        return mimeMap[mimeType] || mimeType.split("/")[1]?.toUpperCase() || "Unknown";
    };

    const getDocumentTypeLabel = (documentType: string): string => {
        const documentTypeMap: { [key: string]: string } = {
            "FORM": "Form",
            "REPORT": "Report", 
            "EVIDENCE": "Evidence",
            "CORRESPONDENCE": "Correspondence",
            "IDENTIFICATION": "Identification",
            "LEGAL": "Legal Document",
            "MEDICAL": "Medical Document",
            "OTHER": "Other"
        };
        return documentTypeMap[documentType] || convertToTitleCase(documentType);
    };

    const refreshDocuments = async () => {
        try {
            const documentsResponse = await getCaseDocuments(caseId);
            const documentsData = Array.isArray(documentsResponse.data) ? documentsResponse.data : [];
            setDocuments(documentsData);
            console.log("✅ Documents refreshed:", documentsData);
        } catch (error) {
            console.error("❌ Error refreshing documents:", error);
        }
    };

    const handleViewDocument = (doc: any) => {
        setViewingDocument(doc);
    };

    const handleDownloadDocument = (doc: any) => {
        // For now, we'll try to download the document URL if available
        if (doc.file_url || doc.url) {
            const link = document.createElement('a');
            link.href = doc.file_url || doc.url;
            link.download = doc.document_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // If no direct URL, show info about the limitation
            alert(`Cannot download "${doc.document_name}"\n\nReason: Document URL not available in the API response.\nThis may require additional backend configuration for S3 presigned URLs.`);
        }
    };

    const handleEditDocument = (doc: any) => {
        setEditingDocument(doc);
        setEditFormData({
            document_name: doc.document_name || '',
            document_type: doc.document_type || 'OTHER',
            description: doc.description || '',
            tags: Array.isArray(doc.tags) ? doc.tags.join(', ') : ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingDocument) return;
        
        try {
            setIsOperationLoading(true);
            const dataToSave = {
                document_name: editFormData.document_name,
                document_type: editFormData.document_type,
                description: editFormData.description,
                tags: editFormData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
            };
            await updateCaseDocument(caseId, editingDocument.id, dataToSave);
            setEditingDocument(null);
            setEditFormData({ document_name: '', document_type: '', description: '', tags: '' });
            await refreshDocuments();
            alert('Document updated successfully!');
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Error updating document. Please try again.');
        } finally {
            setIsOperationLoading(false);
        }
    };

    const handleDeleteDocument = async (doc: any) => {
        const confirmed = confirm(`Are you sure you want to delete "${doc.document_name}"?\n\nThis action cannot be undone.`);
        if (!confirmed) return;

        try {
            setIsOperationLoading(true);
            await deleteCaseDocument(caseId, doc.id);
            await refreshDocuments();
            alert('Document deleted successfully!');
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error deleting document. Please try again.');
        } finally {
            setIsOperationLoading(false);
        }
    };

    const handleAddDocuments = () => {
        setShowUploadDialog(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadFiles(files);
    };

    const handleUploadDocuments = async () => {
        if (uploadFiles.length === 0) return;

        try {
            setIsOperationLoading(true);
            
            for (let i = 0; i < uploadFiles.length; i++) {
                const file = uploadFiles[i];
                console.log(`📤 Uploading file ${i + 1}/${uploadFiles.length}:`, file.name);
                
                // Generate upload link
                const uploadResponse = await generateCaseDocumentUploadLink(caseId, file.type);
                const uploadUrl = uploadResponse.data.link;
                
                // Upload file to S3
                const uploadResult = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                });
                
                if (!uploadResult.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }
                
                // Extract file key from the upload URL
                const fileKey = new URL(uploadUrl).pathname.substring(1);
                
                // Save document metadata
                await createCaseDocument(caseId, {
                    document_name: file.name,
                    document_type: 'OTHER', // Default type
                    description: `Uploaded file: ${file.name}`,
                    tags: [],
                    file_name: file.name,
                    file_size: file.size,
                    mime_type: file.type,
                    file_key: fileKey,
                });
            }
            
            await refreshDocuments();
            setShowUploadDialog(false);
            setUploadFiles([]);
            alert(`Successfully uploaded ${uploadFiles.length} document(s)!`);
            
        } catch (error) {
            console.error('Error uploading documents:', error);
            alert('Error uploading documents. Please try again.');
        } finally {
            setIsOperationLoading(false);
        }
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const getDescriptionText = () => {
        if (!caseData?.description) return '';
        const words = caseData.description.split(' ');
        if (words.length <= 50 || isDescriptionExpanded) {
            return caseData.description;
        }
        return words.slice(0, 50).join(' ') + '...';
    };

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                setIsLoading(true);
                
                console.log("📋 Fetching case details for caseId:", caseId);
                
                // Try to fetch real case data from API
                const caseResponse = await getCaseById(caseId);
                console.log("✅ Case data fetched successfully:", caseResponse.data);
                
                // Try to fetch case documents
                let documentsData = [];
                try {
                    const documentsResponse = await getCaseDocuments(caseId);
                    documentsData = Array.isArray(documentsResponse.data) ? documentsResponse.data : [];
                    console.log("✅ Case documents fetched:", documentsData);
                } catch (docError: any) {
                    console.warn("⚠️ Error fetching documents (non-critical):", docError);
                    documentsData = [];
                }
                
                // Ensure case data has proper array fields
                const processedCaseData = {
                    ...caseResponse.data,
                    service_types: Array.isArray(caseResponse.data.service_types) ? caseResponse.data.service_types : [],
                    tags: Array.isArray(caseResponse.data.tags) ? caseResponse.data.tags : []
                };
                
                setCaseData(processedCaseData);
                setDocuments(documentsData);
                setError(false);
                
            } catch (err: any) {
                console.error("❌ Error fetching case data:", {
                    error: err.message,
                    status: err?.response?.status,
                    statusText: err?.response?.statusText,
                    responseData: err?.response?.data,
                    caseId
                });
                
                // Only use mock data in development mode for testing
                if (process.env.NODE_ENV === 'development') {
                    console.log("🎭 Development mode: Using mock data for case detail due to API failure");
                    
                    const mockCaseData = {
                        id: caseId,
                        case_number: "CASE-2025-8241", 
                        title: "Emergency Housing Assistance",
                        status: "IN_PROGRESS" as const,
                        priority: "HIGH" as const,
                        description: "Legal assistance case for domestic violence situation. Beneficiary requires immediate support for legal proceedings and documentation assistance. Case involves coordination with local authorities and shelter accommodation.",
                        created_at: "2025-01-15T10:30:00Z",
                        updated_at: "2025-01-18T14:45:00Z",
                        service_types: ["LEGAL_AID_ASSISTANCE", "MHPSS", "EMERGENCY_SHELTER_HOUSING"],
                        tags: ["urgent", "documentation", "legal", "domestic-violence", "priority"],
                        beneficiary: {
                            id: "mock-beneficiary-1",
                            full_name: "Matheus Souza"
                        },
                        assigned_to: {
                            id: "mock-user-id", 
                            first_name: "Ana",
                            last_name: "Silva"
                        },
                        beneficiary_id: "mock-beneficiary-1",
                        assigned_to_id: "mock-user-id",
                        urgency_level: "IMMEDIATE" as const,
                        due_date: "2025-02-15T00:00:00Z",
                        estimated_duration: "2 Weeks",
                        budget_allocated: "1000",
                        notes_count: 3,
                        documents_count: 2,
                        last_activity: "2025-01-18T14:45:00Z"
                    };

                    const mockDocuments = [
                        {
                            id: "mock-doc-1",
                            document_name: "Identity Document Copy",
                            document_type: "IDENTIFICATION",
                            description: "Copy of beneficiary's identity document for verification purposes",
                            file_size: 2048576,
                            mime_type: "application/pdf",
                            tags: ["identity", "verification"],
                            created_at: "2025-01-15T11:00:00Z",
                            uploaded_by: { name: "Case Worker" }
                        },
                        {
                            id: "mock-doc-2", 
                            document_name: "Legal Consultation Notes",
                            document_type: "LEGAL",
                            description: "Notes from the initial legal consultation session",
                            file_size: 1024000,
                            mime_type: "application/pdf", 
                            tags: ["consultation", "legal", "notes"],
                            created_at: "2025-01-16T09:30:00Z",
                            uploaded_by: { name: "Legal Advisor" }
                        }
                    ];

                    // Ensure mock data has proper array fields
                    const processedMockData = {
                        ...mockCaseData,
                        service_types: Array.isArray(mockCaseData.service_types) ? mockCaseData.service_types : [],
                        tags: Array.isArray(mockCaseData.tags) ? mockCaseData.tags : []
                    };
                    
                    setCaseData(processedMockData as unknown as CaseSchema);
                    setDocuments(Array.isArray(mockDocuments) ? mockDocuments : []);
                    setError(false);
                } else {
                    // In production, show error instead of mock data
                    console.error("🚨 Production: Case data fetch failed, showing error");
                    setError(true);
                }
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
            <div className="w-full h-max p-6">
                <div className="text-relif-orange-400 font-medium text-sm">Loading case information...</div>
            </div>
        );
    }

    if (error || !caseData) {
        return (
            <div className="w-full h-max p-6">
                <div className="text-red-500 font-medium text-sm">Error loading case information.</div>
            </div>
        );
    }

    return (
        <div className="w-full h-max flex flex-col gap-2">
            {/* Case Header Card */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full flex justify-between items-start">
                        <div className="flex-1"></div>
                        <div className="flex flex-col items-center text-center flex-1">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                {caseData.title}
                            </h1>
                            <h2 className="text-base font-medium text-slate-500 mb-3">
                                {caseData.case_number}
                            </h2>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <Link href={`${pathname}/edit`}>
                                <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white font-medium">
                                    <FaEdit className="w-4 h-4 mr-2" />
                                    Edit Case
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                            <Badge 
                                className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 font-medium"
                            >
                                <FaFlag className="w-3 h-3 mr-1" />
                                {convertToTitleCase(caseData.priority)} Priority
                            </Badge>
                            <Badge 
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 font-medium"
                            >
                                <FaClock className="w-3 h-3 mr-1" />
                                {convertToTitleCase(caseData.status.replace('_', ' '))}
                            </Badge>
                            {caseData.urgency_level && (
                                <Badge 
                                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1 font-medium"
                                >
                                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                                    {convertToTitleCase(caseData.urgency_level.replace('_', ' '))} Urgency
                                </Badge>
                            )}
                        </div>
                        <span className="text-sm text-slate-500 flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4 text-relif-orange-200" />
                            Created on {formatDate(caseData.created_at, locale)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Case Assignment Card */}
            <div className="w-full h-max p-4 rounded-lg bg-relif-orange-500 flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-base pb-2 flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        Case Assignment
                    </h3>
                    <div className="text-xs text-slate-50 flex flex-col gap-1">
                        <span className="flex items-center gap-2">
                            <FaIdCard className="w-3 h-3" />
                            <strong>Beneficiary:</strong> {caseData.beneficiary.full_name}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaUserShield className="w-3 h-3" />
                            <strong>Case Worker:</strong> {caseData.assigned_to ? `${caseData.assigned_to.first_name} ${caseData.assigned_to.last_name}` : 'Unassigned'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white text-white hover:border-relif-orange-200 hover:text-relif-orange-200"
                        asChild
                    >
                        <Link href={`/${locale}/app/${pathname.split("/")[3]}/beneficiaries/${caseData.beneficiary.id}`}>
                            View Beneficiary
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Case Information and Timeline Grid */}
            <div className="w-full grid grid-cols-2 gap-2 lg:flex lg:flex-col">
                {/* Case Information Card */}
                <div className="w-full border-[1px] border-slate-200 rounded-lg p-4 flex flex-col h-[750px]">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaFileAlt className="w-4 h-4" />
                        Case Information
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 flex flex-col">
                        <ul className="space-y-0 flex-shrink-0">
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Title:</strong> {caseData.title}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Status:</strong> {convertToTitleCase(caseData.status.replace('_', ' '))}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Priority:</strong> {convertToTitleCase(caseData.priority)}
                            </li>
                            {caseData.urgency_level && (
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Urgency Level:</strong> {convertToTitleCase(caseData.urgency_level.replace('_', ' '))}
                                </li>
                            )}
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Created Date:</strong> {formatDate(caseData.created_at, locale)}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Last Updated:</strong> {formatDate(caseData.updated_at, locale)}
                            </li>
                            {caseData.due_date && (
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Due Date:</strong> {formatDate(caseData.due_date, locale)}
                                </li>
                            )}
                            {caseData.estimated_duration && (
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Estimated Duration:</strong> {caseData.estimated_duration}
                                </li>
                            )}
                            {caseData.budget_allocated && (
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Budget Allocated:</strong> ${caseData.budget_allocated}
                                </li>
                            )}
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Service Types:</strong>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {(Array.isArray(caseData.service_types) ? caseData.service_types : []).map((serviceType: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs font-medium">
                                            {getServiceTypeLabel(serviceType)}
                                        </Badge>
                                    ))}
                                </div>
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Case Tags:</strong>
                                {(caseData.tags && caseData.tags.length > 0) ? (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {caseData.tags.map((tag: string, index: number) => (
                                            <Badge key={index} className="bg-relif-orange-100 text-relif-orange-800 hover:bg-relif-orange-200 text-xs font-medium">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-slate-500 text-xs ml-2">No tags assigned</span>
                                )}
                            </li>
                        </ul>

                        <div className="mt-4 pt-4 border-t-[1px] border-slate-100 flex-1 flex flex-col">
                            <strong className="text-sm text-slate-900 mb-2">Description:</strong>
                            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg flex-1 flex flex-col">
                                <div className="flex-1 overflow-y-auto">
                                    <p className="whitespace-pre-wrap">
                                        {getDescriptionText()}
                                    </p>
                                </div>
                                {caseData?.description && caseData.description.split(' ').length > 50 && (
                                    <div className="mt-2 pt-2 border-t border-slate-200">
                                        <button
                                            onClick={toggleDescription}
                                            className="text-relif-orange-200 hover:text-relif-orange-300 text-xs font-medium underline focus:outline-none"
                                        >
                                            {isDescriptionExpanded ? 'Show Less' : `Read More (${caseData.description.split(' ').length} words)`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case Timeline Card */}
                <div className="w-full h-[750px]">
                    <CaseTimeline caseId={caseId} onTimelineEventsLoad={setTimelineEventCount} />
                </div>
            </div>

            {/* Case Activity Summary Card */}
            <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                    <FaStickyNote className="w-4 h-4" />
                    Case Activity
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{timelineEventCount}</div>
                        <div className="text-xs text-blue-600 font-medium">Timeline Events</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{documents.length}</div>
                        <div className="text-xs text-green-600 font-medium">Documents</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t-[1px] border-slate-100">
                    <div className="text-sm">
                        <span className="text-slate-600">Recent Activity: </span>
                        <span className="text-slate-500">{formatDate(caseData.updated_at, locale)}</span>
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-relif-orange-200 font-bold text-lg flex items-center gap-2">
                            <FaFileAlt className="text-lg" />
                            Case Documents ({documents.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white font-medium"
                                onClick={handleAddDocuments}
                                disabled={isOperationLoading}
                            >
                                <FaFileAlt className="w-4 h-4 mr-2" />
                                {isOperationLoading ? 'Uploading...' : 'Add Documents'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {(Array.isArray(documents) ? documents : []).map(doc => (
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

                                    <p className="text-sm text-slate-600 mb-3">
                                        {doc.description}
                                    </p>

                                    <div className="flex gap-1 mb-3 flex-wrap">
                                        {(Array.isArray(doc.tags) ? doc.tags : []).map((tag: string, index: number) => (
                                            <Badge
                                                key={`doc-${doc.id}-tag-${index}`}
                                                className="bg-relif-orange-100 text-relif-orange-800 text-xs"
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="font-medium">
                                            {getMimeTypeLabel(doc.mime_type)} • {formatFileSize(doc.file_size)}
                                        </span>
                                        <span>By {doc.uploaded_by?.name || 'Unknown User'}</span>
                                        <span>{formatDate(doc.created_at, locale)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-1 ml-4">
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleViewDocument(doc)}
                                            disabled={isOperationLoading}
                                        >
                                            <FaEye className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                            View
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDownloadDocument(doc)}
                                            disabled={isOperationLoading}
                                        >
                                            <FaDownload className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                            Download
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleEditDocument(doc)}
                                            disabled={isOperationLoading}
                                        >
                                            <FaEdit className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                            Edit
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDeleteDocument(doc)}
                                            disabled={isOperationLoading}
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                            Delete
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Document Modal */}
            {editingDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Edit Document</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit();
                            }}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Document Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.document_name}
                                        onChange={(e) => setEditFormData({...editFormData, document_name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Document Type
                                    </label>
                                    <select
                                        value={editFormData.document_type}
                                        onChange={(e) => setEditFormData({...editFormData, document_type: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="FORM">Form</option>
                                        <option value="REPORT">Report</option>
                                        <option value="EVIDENCE">Evidence</option>
                                        <option value="CORRESPONDENCE">Correspondence</option>
                                        <option value="IDENTIFICATION">Identification</option>
                                        <option value="LEGAL">Legal Document</option>
                                        <option value="MEDICAL">Medical Document</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.tags}
                                        onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                                        placeholder="tag1, tag2, tag3"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="submit"
                                    className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                                    disabled={isOperationLoading}
                                >
                                    {isOperationLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingDocument(null);
                                        setEditFormData({ document_name: '', document_type: '', description: '', tags: '' });
                                    }}
                                    disabled={isOperationLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Document Upload Dialog */}
            {showUploadDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Files
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                    onChange={handleFileSelect}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                                </p>
                            </div>

                            {uploadFiles.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selected Files ({uploadFiles.length})
                                    </label>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                        {uploadFiles.map((file, index) => (
                                            <div key={index} className="text-sm text-gray-600 flex justify-between items-center">
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handleUploadDocuments}
                                className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                                disabled={isOperationLoading || uploadFiles.length === 0}
                            >
                                {isOperationLoading ? 'Uploading...' : 'Upload Documents'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowUploadDialog(false);
                                    setUploadFiles([]);
                                }}
                                disabled={isOperationLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Viewer */}
            <DocumentViewer
                isOpen={!!viewingDocument}
                onClose={() => setViewingDocument(null)}
                document={viewingDocument}
            />
        </div>
    );
};

export default Content;
