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
    DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCalendarAlt, FaEdit, FaFileAlt, FaStickyNote, FaUser, FaClock, FaDollarSign, FaFlag, FaTrash, FaTags } from "react-icons/fa";
import { getCaseById, getCaseDocuments, uploadCaseDocument, generateCaseDocumentUploadLink, createCaseDocument } from "@/repository/organization.repository";
import { CreateCaseDocumentPayload } from "@/types/case.types";

const CaseOverview = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const [caseData, setCaseData] = useState<CaseSchema | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        document_name: '',
        description: '',
        document_type: '',
        tags: [] as string[],
        is_finalized: false
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
        document_name: '',
        document_type: 'OTHER',
        description: '',
        tags: []
    });
    const [isUploading, setIsUploading] = useState(false);

    const caseId = pathname.split("/")[5];
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const handleDeleteDocument = (doc: any) => {
        setDocumentToDelete(doc);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteDocument = () => {
        if (documentToDelete && Array.isArray(documents)) {
            // Remove document from the list
            setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
            // Here you would also make an API call to delete the document
            console.log("Deleting document:", documentToDelete.id);
        }
    };

    const handleEditDocument = (doc: any) => {
        setDocumentToEdit(doc);
        setEditFormData({
            document_name: doc.document_name,
            description: doc.description,
            document_type: doc.document_type,
            tags: doc.tags || [],
            is_finalized: doc.is_finalized
        });
        setEditDialogOpen(true);
    };

    const confirmEditDocument = () => {
        if (documentToEdit && Array.isArray(documents)) {
            // Update document in the list
            setDocuments(documents.map(doc => 
                doc.id === documentToEdit.id 
                    ? { ...doc, ...editFormData }
                    : doc
            ));
            setEditDialogOpen(false);
            setDocumentToEdit(null);
            // Here you would also make an API call to update the document
            console.log("Updating document:", documentToEdit.id, editFormData);
        }
    };

    const handleTagAdd = (tag: string) => {
        if (tag.trim() && !editFormData.tags.includes(tag.trim())) {
            setEditFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()]
            }));
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setEditFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleUploadDocument = () => {
        // Create a file input element to trigger file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
        input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            if (files.length > 0) {
                setUploadFiles(files);
                setUploadFormData({
                    document_name: files[0].name.replace(/\.[^/.]+$/, ""), // Remove extension for default name
                    document_type: 'OTHER',
                    description: '',
                    tags: []
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
                // Step 1: Get S3 upload link
                const { data: uploadLinkData } = await generateCaseDocumentUploadLink(file.type);
                
                // Step 2: Upload file directly to S3
                await fetch(uploadLinkData.link, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });
                
                // Step 3: Get S3 URL without query parameters
                const s3Url = uploadLinkData.link.split("?")[0];
                
                // Step 4: Create document record in database
                await createCaseDocument(caseId, {
                    document_name: uploadFormData.document_name || file.name.replace(/\.[^/.]+$/, ""),
                    document_type: uploadFormData.document_type,
                    description: uploadFormData.description,
                    tags: uploadFormData.tags,
                    file_url: s3Url,
                    file_name: file.name,
                    file_size: file.size,
                    mime_type: file.type,
                });
            }
            
            // Refresh documents list
            const documentsResult = await getCaseDocuments(caseId);
            if (Array.isArray(documentsResult?.data)) {
                setDocuments(documentsResult.data);
            }
            
            // Reset form and close dialog
            setUploadFiles([]);
            setUploadFormData({
                document_name: '',
                document_type: 'OTHER',
                description: '',
                tags: []
            });
            setUploadDialogOpen(false);
            
            alert(`Successfully uploaded ${uploadFiles.length} document(s)!`);
        } catch (error) {
            console.error('Error uploading documents:', error);
            alert('Error uploading documents. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadTagAdd = (tag: string) => {
        if (tag.trim() && !uploadFormData.tags.includes(tag.trim())) {
            setUploadFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()]
            }));
        }
    };

    const handleUploadTagRemove = (tagToRemove: string) => {
        setUploadFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                if (caseId) {
                    const [caseResult, documentsResult] = await Promise.all([
                        getCaseById(caseId),
                        getCaseDocuments(caseId)
                    ]);
                    setCaseData(caseResult.data);
                    
                    // Ensure documents is always an array
                    const documentsData = documentsResult?.data;
                    if (Array.isArray(documentsData)) {
                        setDocuments(documentsData);
                    } else {
                        console.warn("Documents data is not an array:", documentsData);
                        setDocuments([]);
                    }
                }
            } catch (err) {
                console.error("Error fetching case data:", err);
                setError(true);
                setDocuments([]); // Ensure documents is empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId]);

    if (isLoading) {
        return (
            <div className="p-4 text-relif-orange-400 font-medium text-sm">
                Loading case details...
            </div>
        );
    }

    if (error || !caseData) {
        return (
            <div className="p-4 text-red-600 font-medium text-sm">
                Error loading case details
            </div>
        );
    }

    const PRIORITY_COLORS = {
        LOW: "bg-green-100 text-green-800 hover:bg-green-200",
        MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        HIGH: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        URGENT: "bg-red-100 text-red-800 hover:bg-red-200",
    };

    const STATUS_COLORS = {
        IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        PENDING: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        ON_HOLD: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };

    const URGENCY_COLORS = {
        IMMEDIATE: "bg-red-100 text-red-800 hover:bg-red-200",
        WITHIN_WEEK: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        WITHIN_MONTH: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        FLEXIBLE: "bg-green-100 text-green-800 hover:bg-green-200",
    };

    const isOverdue = caseData.due_date && new Date(caseData.due_date) < new Date();

    return (
        <div className="w-full h-max flex flex-col gap-2">
            {/* Case Header */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {convertToTitleCase(caseData.title)}
                        </h2>
                        <span className="text-sm text-slate-500">
                            {caseData.case_number} • {convertToTitleCase(caseData.case_type.replace('_', ' '))}
                        </span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`${pathname}/edit`}>
                            <FaEdit className="w-4 h-4 mr-2" />
                            Edit Case
                        </Link>
                    </Button>
                </div>
                <div className="flex gap-2 flex-wrap w-full">
                    <Badge className={STATUS_COLORS[caseData.status as keyof typeof STATUS_COLORS]}>
                        {caseData.status.replace("_", " ")}
                    </Badge>
                    <Badge className={PRIORITY_COLORS[caseData.priority as keyof typeof PRIORITY_COLORS]}>
                        {caseData.priority}
                    </Badge>
                    {caseData.urgency_level && (
                        <Badge className={URGENCY_COLORS[caseData.urgency_level as keyof typeof URGENCY_COLORS]}>
                            {caseData.urgency_level.replace("_", " ")}
                        </Badge>
                    )}
                    {isOverdue && (
                        <Badge className="bg-red-200 text-red-900 hover:bg-red-300">
                            OVERDUE
                        </Badge>
                    )}
                </div>
            </div>

            {/* Case Details Grid */}
            <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
                {/* Case Information */}
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaFileAlt />
                        Case Information
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Description:</strong> {caseData.description}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Due Date:</strong> {caseData.due_date ? formatDate(caseData.due_date, locale) : "No due date set"}
                        </li>
                        {caseData.estimated_duration && (
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Estimated Duration:</strong> {convertToTitleCase(caseData.estimated_duration.replace('_', ' '))}
                            </li>
                        )}
                        {caseData.budget_allocated && (
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Budget Allocated:</strong> {caseData.budget_allocated}
                            </li>
                        )}
                        {caseData.urgency_level && (
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Urgency Level:</strong> {convertToTitleCase(caseData.urgency_level.replace('_', ' '))}
                            </li>
                        )}
                        {caseData.tags && caseData.tags.length > 0 && (
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2 flex-wrap">
                                <strong>Tags:</strong>
                                {caseData.tags.map((tag, index) => (
                                    <Badge key={index} className="bg-relif-orange-500 text-xs">
                                        #{tag}
                                    </Badge>
                                ))}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Assignment & Timeline */}
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaUser />
                        Assignment & Timeline
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Beneficiary:</strong> {caseData.beneficiary.full_name}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Assigned To:</strong> {caseData.assigned_to.first_name} {caseData.assigned_to.last_name}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Created:</strong> {formatDate(caseData.created_at, locale)}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Last Updated:</strong> {formatDate(caseData.updated_at, locale)}
                        </li>
                    </ul>

                    <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4 flex flex-wrap items-center gap-2">
                        <FaFileAlt />
                        Activity Summary
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Updates:</strong> {caseData.notes_count}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Documents:</strong> {caseData.documents_count}
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
                            className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                            onClick={handleUploadDocument}
                        >
                            <FaFileAlt className="w-4 h-4 mr-2" />
                            Upload Document
                        </Button>
                        <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                            <FaEdit className="w-4 h-4 mr-2" />
                            Manage All
                        </Button>
                    </div>
                </div>
                
                {!Array.isArray(documents) || documents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <FaFileAlt className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No documents uploaded yet</p>
                        <p className="text-sm text-slate-400 mt-1">Upload your first document to get started.</p>
                    </div>
                ) : (
                    <>
                        {/* Documents List */}
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="border border-gray-200 bg-white rounded-lg p-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-medium text-sm text-slate-900">
                                                    {doc.document_name}
                                                </h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {doc.document_type}
                                                </Badge>
                                                {doc.is_finalized ? (
                                                    <Badge className="text-xs bg-green-100 text-green-800">
                                                        Finalized
                                                    </Badge>
                                                ) : (
                                                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            <p className="text-xs text-slate-600 mb-2">
                                                {doc.description}
                                            </p>
                                            
                                            {doc.tags && doc.tags.length > 0 && (
                                                <div className="flex gap-1 mb-2 flex-wrap">
                                                    {doc.tags.map((tag: string, index: number) => (
                                                        <Badge key={index} className="bg-relif-orange-500 text-xs">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>{doc.file_type} • {doc.file_size}</span>
                                                <span>By {doc.uploaded_by}</span>
                                                <span>{formatDate(doc.uploaded_at, locale)}</span>
                                            </div>
                                        </div>
                                        
                                                                <div className="flex gap-1 ml-3">
                            <Button size="sm" className="text-xs px-2 py-1 bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                                View
                            </Button>
                            <Button size="sm" className="text-xs px-2 py-1 bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                                Download
                            </Button>
                            {!doc.is_finalized && (
                                <Button 
                                    size="sm" 
                                    className="text-xs px-2 py-1 bg-relif-orange-200 hover:bg-relif-orange-300 text-white"
                                    onClick={() => handleEditDocument(doc)}
                                >
                                    <FaEdit className="w-3 h-3 mr-1" />
                                    Edit
                                </Button>
                            )}
                            <Button 
                                size="sm" 
                                className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
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
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDeleteDocument}
                        >
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
                                        onChange={(e) => setEditFormData(prev => ({
                                            ...prev,
                                            document_name: e.target.value
                                        }))}
                                    />
                                </div>

                                {/* Document Type */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="document_type">Document Type</Label>
                                    <Select 
                                        value={editFormData.document_type} 
                                        onValueChange={(value) => setEditFormData(prev => ({
                                            ...prev,
                                            document_type: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Application Form">Application Form</SelectItem>
                                            <SelectItem value="Verification Letter">Verification Letter</SelectItem>
                                            <SelectItem value="Background Check">Background Check</SelectItem>
                                            <SelectItem value="Medical Records">Medical Records</SelectItem>
                                            <SelectItem value="Reference Letter">Reference Letter</SelectItem>
                                            <SelectItem value="Legal Document">Legal Document</SelectItem>
                                            <SelectItem value="Financial Document">Financial Document</SelectItem>
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
                                    onChange={(e) => setEditFormData(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
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
                                            key={index} 
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
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleTagAdd(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>

                            {/* Finalized Status */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_finalized"
                                    checked={editFormData.is_finalized}
                                    onCheckedChange={(checked) => setEditFormData(prev => ({
                                        ...prev,
                                        is_finalized: checked as boolean
                                    }))}
                                />
                                <Label htmlFor="is_finalized">Mark as finalized</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-5">
                        <Button 
                            variant="outline" 
                            onClick={() => setEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmEditDocument}
                        >
                            Save Changes
                        </Button>
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
                                <div key={index} className="text-sm text-slate-600">
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
                                        onChange={(e) => setUploadFormData(prev => ({
                                            ...prev,
                                            document_name: e.target.value
                                        }))}
                                    />
                                </div>

                                {/* Document Type */}
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="upload_document_type">Document Type</Label>
                                    <Select 
                                        value={uploadFormData.document_type} 
                                        onValueChange={(value) => setUploadFormData(prev => ({
                                            ...prev,
                                            document_type: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FORM">Form</SelectItem>
                                            <SelectItem value="REPORT">Report</SelectItem>
                                            <SelectItem value="EVIDENCE">Evidence</SelectItem>
                                            <SelectItem value="CORRESPONDENCE">Correspondence</SelectItem>
                                            <SelectItem value="IDENTIFICATION">Identification</SelectItem>
                                            <SelectItem value="LEGAL">Legal Document</SelectItem>
                                            <SelectItem value="MEDICAL">Medical Document</SelectItem>
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
                                    onChange={(e) => setUploadFormData(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    rows={3}
                                />
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="upload_tags">Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {uploadFormData.tags.map((tag, index) => (
                                        <Badge 
                                            key={index} 
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
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleUploadTagAdd(e.currentTarget.value);
                                            e.currentTarget.value = '';
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
                            {isUploading ? 'Uploading...' : `Upload ${uploadFiles.length} Document(s)`}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { CaseOverview }; 