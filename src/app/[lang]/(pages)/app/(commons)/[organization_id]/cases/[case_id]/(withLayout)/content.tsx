"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { getServiceTypeLabel } from "@/utils/serviceTypeLabels";
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
} from "react-icons/fa";
import {
    getCaseById,
    getCaseDocuments,
} from "@/repository/organization.repository";

const CaseOverview = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const [caseData, setCaseData] = useState<CaseSchema | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

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
                    documentsData = documentsResponse.data || [];
                    console.log("✅ Case documents fetched:", documentsData);
                } catch (docError: any) {
                    console.warn("⚠️ Error fetching documents (non-critical):", docError);
                    documentsData = [];
                }
                
                setCaseData(caseResponse.data);
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

                    setCaseData(mockCaseData as unknown as CaseSchema);
                    setDocuments(mockDocuments);
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
                                High Priority
                            </Badge>
                            <Badge 
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 font-medium"
                            >
                                <FaClock className="w-3 h-3 mr-1" />
                                In Progress
                            </Badge>
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Case Information Card */}
                <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaFileAlt className="w-4 h-4" />
                        Case Information
                    </h3>
                    
                    <ul className="space-y-0">
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Title:</strong> {caseData.title}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Status:</strong> {convertToTitleCase(caseData.status.replace('_', ' '))}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Priority:</strong> {convertToTitleCase(caseData.priority)}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Created Date:</strong> {formatDate(caseData.created_at, locale)}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Last Updated:</strong> {formatDate(caseData.updated_at, locale)}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Service Types:</strong>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {caseData.service_types.map((serviceType: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs font-medium">
                                        {getServiceTypeLabel(serviceType)}
                                    </Badge>
                                ))}
                            </div>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Tags:</strong>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {(caseData.tags || []).map((tag: string, index: number) => (
                                    <Badge key={index} className="bg-relif-orange-100 text-relif-orange-800 hover:bg-relif-orange-200 text-xs font-medium">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </li>
                    </ul>

                    <div className="mt-4 pt-4 border-t-[1px] border-slate-100">
                        <strong className="text-sm text-slate-900">Description:</strong>
                        <p className="text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg">
                            {caseData.description}
                        </p>
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
                            <div className="text-2xl font-bold text-blue-600">5</div>
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
            </div>

            {/* Case Timeline Section */}
            <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                <h3 className="text-relif-orange-200 font-bold text-base pb-4 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Case Timeline (5 events)
                </h3>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                    {/* Timeline events */}
                    <div className="space-y-6">
                        {/* Case Created */}
                        <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-green-200 bg-green-50">
                                <FaPlus className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0 pb-4">
                                <h4 className="text-sm font-semibold text-slate-900">Case Created</h4>
                                <p className="text-sm text-slate-600 mt-1">New case opened for urgent housing assistance</p>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium">Sarah Johnson</span>
                                    <span>(Case Manager)</span>
                                    <span>•</span>
                                    <span>Jan 15, 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Case Assigned */}
                        <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-purple-200 bg-purple-50">
                                <FaUserCheck className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0 pb-4">
                                <h4 className="text-sm font-semibold text-slate-900">Case Assigned</h4>
                                <p className="text-sm text-slate-600 mt-1">Case assigned to case worker</p>
                                <div className="mt-2">
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                                        John Smith
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium">Admin User</span>
                                    <span>(Administrator)</span>
                                    <span>•</span>
                                    <span>Jan 15, 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Priority Updated */}
                        <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-orange-200 bg-orange-50">
                                <FaExclamationTriangle className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0 pb-4">
                                <h4 className="text-sm font-semibold text-slate-900">Priority Updated</h4>
                                <p className="text-sm text-slate-600 mt-1">Case priority changed from Medium to High</p>
                                <div className="flex items-center gap-2 text-xs mt-2">
                                    <Badge variant="outline" className="text-red-600 border-red-200">Medium</Badge>
                                    <span className="text-slate-500">→</span>
                                    <Badge variant="outline" className="text-green-600 border-green-200">High</Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium">Sarah Johnson</span>
                                    <span>(Case Manager)</span>
                                    <span>•</span>
                                    <span>Jan 15, 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Document Added */}
                        <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-200 bg-cyan-50">
                                <FaFileAlt className="w-4 h-4 text-cyan-600" />
                            </div>
                            <div className="flex-1 min-w-0 pb-4">
                                <h4 className="text-sm font-semibold text-slate-900">Document Added</h4>
                                <p className="text-sm text-slate-600 mt-1">New document uploaded to case</p>
                                <div className="mt-2">
                                    <Badge variant="outline" className="text-cyan-600 border-cyan-200 text-xs">
                                        📄 Housing Application Form
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium">John Smith</span>
                                    <span>(Case Worker)</span>
                                    <span>•</span>
                                    <span>Jan 16, 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Changed */}
                        <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-blue-50">
                                <FaFlag className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0 pb-4">
                                <h4 className="text-sm font-semibold text-slate-900">Status Updated</h4>
                                <p className="text-sm text-slate-600 mt-1">Case status changed to In Progress</p>
                                <div className="flex items-center gap-2 text-xs mt-2">
                                    <Badge variant="outline" className="text-red-600 border-red-200">Open</Badge>
                                    <span className="text-slate-500">→</span>
                                    <Badge variant="outline" className="text-green-600 border-green-200">In Progress</Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium">John Smith</span>
                                    <span>(Case Worker)</span>
                                    <span>•</span>
                                    <span>Jan 18, 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline end indicator */}
                    <div className="relative flex items-center gap-4 mt-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-300 bg-slate-100">
                            <FaCheck className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="text-sm text-slate-500 italic">
                            Timeline current
                        </div>
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
                                onClick={() => alert('Demo: Add Documents')}
                            >
                                <FaFileAlt className="w-4 h-4 mr-2" />
                                Add Documents
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50 font-medium"
                                onClick={() => alert('Demo: Download All')}
                            >
                                <FaDownload className="w-4 h-4 mr-2" />
                                Download All
                            </Button>
                        </div>
                    </div>
                </div>

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

                                    <p className="text-sm text-slate-600 mb-3">
                                        {doc.description}
                                    </p>

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
                                        onClick={() => alert('Demo: View Document')}
                                    >
                                        <FaEye className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() => alert('Demo: Download Document')}
                                    >
                                        <FaDownload className="w-3 h-3 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CaseOverview;
