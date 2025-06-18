"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FaDownload, 
    FaExpand, 
    FaCompress, 
    FaExclamationTriangle,
    FaSpinner,
    FaFileAlt,
    FaImage,
    FaFilePdf
} from "react-icons/fa";
import { X } from "lucide-react";

interface DocumentViewerProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
        id: string;
        document_name: string;
        file_url?: string;
        url?: string;
        mime_type: string;
        file_size: number;
        document_type?: string;
        description?: string;
        created_at?: string;
        uploaded_by?: {
            name: string;
        };
    } | null;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FaImage className="w-5 h-5" />;
    if (mimeType === "application/pdf") return <FaFilePdf className="w-5 h-5" />;
    return <FaFileAlt className="w-5 h-5" />;
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
    return documentTypeMap[documentType] || documentType;
};

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
    isOpen,
    onClose,
    document
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (document && isOpen) {
            setIsLoading(true);
            setHasError(false);
        }
    }, [document, isOpen]);

    if (!document) return null;

    const documentUrl = document.file_url || document.url;

    const handleDownload = () => {
        if (documentUrl) {
            const link = window.document.createElement('a');
            link.href = documentUrl;
            link.download = document.document_name;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
        }
    };

    const renderDocumentContent = () => {
        if (!documentUrl) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <FaExclamationTriangle className="w-12 h-12 mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Document URL Not Available</h3>
                    <p className="text-sm text-center max-w-md">
                        This document cannot be previewed because the file URL is not available.
                    </p>
                </div>
            );
        }

        if (document.mime_type.startsWith("image/")) {
            return (
                <div className="flex justify-center items-center min-h-96">
                    <img
                        src={documentUrl}
                        alt={document.document_name}
                        className="max-w-full max-h-[70vh] object-contain"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                </div>
            );
        }

        if (document.mime_type === "application/pdf") {
            return (
                <div className="w-full h-[70vh] border border-gray-200 rounded">
                    <iframe
                        src={`${documentUrl}#toolbar=1`}
                        className="w-full h-full rounded"
                        title={document.document_name}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                {getDocumentIcon(document.mime_type)}
                <h3 className="text-lg font-semibold mb-2 mt-4">Preview Not Available</h3>
                <p className="text-sm text-center max-w-md mb-4">
                    This file type cannot be previewed in the browser.
                </p>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                    <FaDownload className="w-4 h-4" />
                    Download File
                </Button>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl w-full">
                <DialogHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg font-semibold flex items-center gap-3">
                                {getDocumentIcon(document.mime_type)}
                                <span className="truncate">{document.document_name}</span>
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-500">
                                    {formatFileSize(document.file_size)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                            {documentUrl && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDownload}
                                    className="flex items-center gap-1"
                                >
                                    <FaDownload className="w-3 h-3" />
                                    Download
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded z-10">
                            <div className="flex flex-col items-center gap-3">
                                <FaSpinner className="w-6 h-6 animate-spin text-blue-500" />
                                <span className="text-sm text-gray-600">Loading document...</span>
                            </div>
                        </div>
                    )}
                    
                    {hasError && (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                            <FaExclamationTriangle className="w-12 h-12 mb-4 text-red-500" />
                            <h3 className="text-lg font-semibold mb-2">Failed to Load Document</h3>
                        </div>
                    )}
                    
                    {!hasError && renderDocumentContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}; 