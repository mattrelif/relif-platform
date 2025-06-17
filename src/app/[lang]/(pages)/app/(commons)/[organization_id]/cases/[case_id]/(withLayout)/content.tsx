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
        is_finalized: false,
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
            is_finalized: doc.is_finalized || false,
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
                is_finalized: editFormData.is_finalized,
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
        if (doc.download_url) {
            // Open document in new tab for viewing
            window.open(doc.download_url, '_blank');
        } else {
            toast({
                title: "View Failed",
                description: "Document URL not available.",
                variant: "destructive",
            });
        }
    };

    const handleDownloadDocument = async (doc: any) => {
        try {
            if (doc.download_url) {
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
                    description: `Downloading ${doc.document_name}...`,
                });
            } else {
                toast({
                    title: "Download Failed",
                    description: "Document URL not available.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error downloading document:", error);
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
        <div className="w-full h-max flex flex-col gap-6">
            {/* Case Header */}
            <div className="w-full flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">
                    Case #{caseData.case_number}
                </h1>
                <div className="flex items-center gap-2">
                    <Badge 
                        className={`${
                            caseData.priority === "HIGH" 
                                ? "bg-red-100 text-red-800" 
                                : caseData.priority === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {convertToTitleCase(caseData.priority)} Priority
                    </Badge>
                    <Badge 
                        className={`${
                            caseData.status === "ACTIVE" 
                                ? "bg-green-100 text-green-800" 
                                : caseData.status === "CLOSED"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {convertToTitleCase(caseData.status)}
                    </Badge>
                    <Link href={`${pathname}/edit`}>
                        <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300">
                            <FaEdit className="w-4 h-4 mr-2" />
                            Edit Case
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Case Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="lg:col-span-2 border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base mb-4 flex items-center gap-2">
                        <FaUser />
                        Case Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Title</p>
                            <p className="text-sm text-slate-900">{caseData.title}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Beneficiary</p>
                            <p className="text-sm text-slate-900">{caseData.beneficiary_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Service Types</p>
                            <div className="flex flex-wrap gap-1">
                                {caseData.service_types && caseData.service_types.length > 0 ? (
                                    caseData.service_types.map((serviceType: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {serviceType}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">No service types assigned</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Case Worker</p>
                            <p className="text-sm text-slate-900">{caseData.case_worker_name || 'Unassigned'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Created Date</p>
                            <p className="text-sm text-slate-900 flex items-center gap-1">
                                <FaCalendarAlt className="w-3 h-3" />
                                {formatDate(caseData.created_at, locale)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Last Updated</p>
                            <p className="text-sm text-slate-900 flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {formatDate(caseData.updated_at, locale)}
                            </p>
                        </div>
                    </div>

                    {caseData.description && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">Description</p>
                            <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                                {caseData.description}
                            </p>
                        </div>
                    )}

                    {caseData.tags && caseData.tags.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {caseData.tags.map((tag: string, index: number) => (
                                    <Badge key={index} className="bg-relif-orange-100 text-relif-orange-800 text-xs">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Case Stats */}
                <div className="border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base mb-4 flex items-center gap-2">
                        <FaStickyNote />
                        Case Activity
                    </h3>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">Updates:</span>
                            <span className="font-medium text-slate-900">{caseData.notes_count || 0}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">Documents:</span>
                            <span className="font-medium text-slate-900">{caseData.documents_count || 0}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Documents Section */}
            <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-relif-orange-200 font-bold text-base flex items-center gap-2">
                        <FaFileAlt />
                        Case Documents ({Array.isArray(documents) ? documents.length : 0})
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={Array.isArray(documents) && documents.length > 0 ? "default" : "outline"}
                            onClick={handleUploadDocument}
                        >
                            <FaFileAlt className="w-4 h-4 mr-2" />
                            {Array.isArray(documents) && documents.length > 0 ? "Add Document" : "Upload Document"}
                        </Button>
                        {Array.isArray(documents) && documents.length > 0 && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleDownloadAllDocuments}
                            >
                                <FaDownload className="w-4 h-4 mr-2" />
                                Download All
                            </Button>
                        )}
                    </div>
                </div>

                {!Array.isArray(documents) || documents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <FaFileAlt className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-base text-slate-600">No documents uploaded yet</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Upload your first document to get started.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Documents List */}
                        <div className="space-y-3">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className="border border-gray-200 bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h4 className="font-semibold text-base text-slate-900">
                                                    {doc.document_name}
                                                </h4>
                                                <Badge variant="outline" className="text-xs font-medium">
                                                    {doc.document_type || 'OTHER'}
                                                </Badge>
                                                {doc.is_finalized ? (
                                                    <Badge className="text-xs bg-green-100 text-green-800 font-medium">
                                                        Final
                                                    </Badge>
                                                ) : (
                                                    <Badge className="text-xs bg-yellow-100 text-yellow-800 font-medium">
                                                        Draft
                                                    </Badge>
                                                )}
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
                                            {!doc.is_finalized && (
                                                <Button
                                                    size="sm"
                                                    className="text-xs px-3 py-1 bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                                                    onClick={() => handleEditDocument(doc)}
                                                >
                                                    <FaEdit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Button>
                                            )}
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

                        {/* Show More Button if many documents */}
                        {Array.isArray(documents) && documents.length > 5 && (
                            <div className="text-center mt-4">
                                <Button variant="outline" size="sm">
                                    View All Documents ({documents.length})
                                </Button>
                            </div>
                        )}
                    </>
                )}
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
                                Tags & Status
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

                            {/* Finalized Status */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_finalized"
                                    checked={editFormData.is_finalized}
                                    onCheckedChange={checked =>
                                        setEditFormData(prev => ({
                                            ...prev,
                                            is_finalized: checked as boolean,
                                        }))
                                    }
                                />
                                <Label htmlFor="is_finalized">Mark as finalized</Label>
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
