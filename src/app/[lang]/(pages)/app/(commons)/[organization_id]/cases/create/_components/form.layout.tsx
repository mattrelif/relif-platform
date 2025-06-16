"use client";

import { useState, ReactNode, ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FaFileAlt, FaUsers, FaTag, FaStickyNote, FaFlag, FaUserTie, FaTags } from "react-icons/fa";
import {
    getBeneficiariesByOrganizationID,
    findUsersByOrganizationId,
    createCase,
    generateCaseDocumentUploadLink,
    createCaseDocument,
    extractFileKeyFromS3Url,
} from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { UserSchema } from "@/types/user.types";
import { CreateCasePayload } from "@/types/case.types";
import { useToast } from "@/components/ui/use-toast";

interface DocumentData {
    file: File;
    name: string;
    type: string;
    description: string;
    tags: string[];
    isFinalized: boolean;
}

interface CaseFormData {
    title: string;
    description: string;
    case_type: string;
    status: string;
    priority: string;
    urgency_level: string;
    beneficiary_id: string;
    assigned_to_id: string;
    due_date: Date | undefined;
    has_due_date: boolean;
    estimated_duration: string;
    budget_allocated: string;
    tags: string[];
    documents: DocumentData[];
    // Notes data matching existing structure
    initial_note: {
        title: string;
        content: string;
        note_type: string;
        is_important: boolean;
        tags: string[];
    };
}

export const CreateCaseForm = (): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [noteTags, setNoteTags] = useState<string[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiarySchema[]>([]);
    const [users, setUsers] = useState<UserSchema[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formData, setFormData] = useState<CaseFormData>({
        title: "",
        description: "",
        case_type: "",
        status: "OPEN",
        priority: "",
        urgency_level: "",
        beneficiary_id: "",
        assigned_to_id: "",
        due_date: undefined,
        has_due_date: false,
        estimated_duration: "",
        budget_allocated: "",
        tags: [],
        documents: [],
        initial_note: {
            title: "",
            content: "",
            note_type: "UPDATE",
            is_important: false,
            tags: [],
        },
    });

    // Load beneficiaries and users on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingData(true);
                const organizationId = pathname.split("/")[3];

                if (!organizationId) {
                    console.error("Organization ID not found");
                    return;
                }

                // Load beneficiaries and users in parallel
                const [beneficiariesResponse, usersResponse] = await Promise.all([
                    getBeneficiariesByOrganizationID(organizationId, 0, 1000, ""),
                    findUsersByOrganizationId(organizationId, 0, 1000),
                ]);

                setBeneficiaries(beneficiariesResponse.data.data || []);
                setUsers(usersResponse.data.data || []);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadData();
    }, [pathname]);

    const handleInputChange = (
        field: keyof CaseFormData,
        value: string | boolean | Date | undefined
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNoteChange = (
        field: keyof typeof formData.initial_note,
        value: string | boolean | string[]
    ) => {
        setFormData(prev => ({
            ...prev,
            initial_note: {
                ...prev.initial_note,
                [field]: value,
            },
        }));
    };

    const handleTagsChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value
                .split(",")
                .map(value => value.trim())
                .filter(value => value);
            setter(values);
            setFormData(prev => ({
                ...prev,
                tags: values,
            }));
        };

    const handleNoteTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const values = event.target.value
            .split(",")
            .map(value => value.trim())
            .filter(value => value);
        setNoteTags(values);
        handleNoteChange("tags", values);
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            due_date: date,
        }));
    };

    const handleDueDateToggle = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            has_due_date: checked,
            due_date: checked ? prev.due_date : undefined,
        }));
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newDocuments: DocumentData[] = files.map(file => ({
            file,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for default name
            type: "OTHER",
            description: "",
            tags: [],
            isFinalized: false,
        }));

        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, ...newDocuments],
        }));
    };

    const updateDocument = (
        index: number,
        field: keyof DocumentData,
        value: string | string[] | boolean
    ) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.map((doc, i) =>
                i === index ? { ...doc, [field]: value } : doc
            ),
        }));
    };

    const finalizeDocument = (index: number) => {
        updateDocument(index, "isFinalized", true);
    };

    const editDocument = (index: number) => {
        updateDocument(index, "isFinalized", false);
    };

    const removeDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index),
        }));
    };

    const addNewDocument = () => {
        // Create a file input element to trigger file selection
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt";
        input.onchange = e => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            const newDocuments: DocumentData[] = files.map(file => ({
                file,
                name: file.name.replace(/\.[^/.]+$/, ""),
                type: "OTHER",
                description: "",
                tags: [],
                isFinalized: false,
            }));

            setFormData(prev => ({
                ...prev,
                documents: [...prev.documents, ...newDocuments],
            }));
        };
        input.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const organizationId = pathname.split("/")[3];

            if (!organizationId) {
                toast({
                    title: "Error",
                    description: "Organization ID not found",
                    variant: "destructive",
                });
                return;
            }

            // Prepare the case payload according to CreateCasePayload interface
            const casePayload: CreateCasePayload = {
                beneficiary_id: formData.beneficiary_id,
                assigned_to_id: formData.assigned_to_id,
                title: formData.title,
                description: formData.description,
                case_type: formData.case_type as CreateCasePayload["case_type"],
                priority: formData.priority as CreateCasePayload["priority"],
                urgency_level: formData.urgency_level
                    ? (formData.urgency_level as CreateCasePayload["urgency_level"])
                    : undefined,
                due_date: formData.due_date ? formData.due_date.toISOString() : undefined,
                estimated_duration: formData.estimated_duration || undefined,
                budget_allocated: formData.budget_allocated || undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
            };

            // Add initial note if provided
            if (formData.initial_note.title || formData.initial_note.content) {
                casePayload.initial_note = {
                    title: formData.initial_note.title,
                    content: formData.initial_note.content,
                    note_type: formData.initial_note.note_type as
                        | "CALL"
                        | "MEETING"
                        | "UPDATE"
                        | "APPOINTMENT"
                        | "OTHER",
                    is_important: formData.initial_note.is_important,
                    tags: formData.initial_note.tags,
                };
            }

            // Create the case
            const response = await createCase(casePayload);
            const newCaseId = response.data.id;

            // Handle document uploads if any documents were added
            if (formData.documents.length > 0) {
                for (const doc of formData.documents) {
                    try {
                        // Step 1: Get presigned upload URL
                        const { data: uploadLinkData } = await generateCaseDocumentUploadLink(
                            newCaseId,
                            doc.file.type
                        );

                        // Step 2: Upload directly to S3
                        await fetch(uploadLinkData.link, {
                            method: "PUT",
                            headers: {
                                "Content-Type": doc.file.type,
                            },
                            body: doc.file,
                        });

                        // Step 3: Extract file key and save metadata
                        const fileKey = extractFileKeyFromS3Url(uploadLinkData.link);

                        await createCaseDocument(newCaseId, {
                            document_name: doc.name,
                            document_type: doc.type,
                            description: doc.description,
                            tags: doc.tags,
                            file_name: doc.file.name,
                            file_size: doc.file.size,
                            mime_type: doc.file.type,
                            file_key: fileKey,
                        });
                    } catch (docError) {
                        console.error(`Error uploading document ${doc.name}:`, docError);
                        // Continue with other documents even if one fails
                    }
                }
            }

            toast({
                title: "Success",
                description: "Case created successfully",
            });

            // Redirect back to cases list
            const casesPath = pathname.replace("/create", "");
            router.push(casesPath);
        } catch (error) {
            console.error("Error creating case:", error);
            toast({
                title: "Error",
                description: "Failed to create case. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        formData.title && formData.case_type && formData.priority && formData.beneficiary_id;

    return (
        <form
            className="w-full h-max p-4 grid grid-cols-2 gap-4 lg:flex lg:flex-col"
            onSubmit={handleSubmit}
        >
            <div className="w-full h-max flex flex-col gap-6">
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaFileAlt /> Case Details
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="title">Case Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Emergency Housing Request"
                            value={formData.title}
                            onChange={e => handleInputChange("title", e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="case_type">Case Type *</Label>
                        <Select
                            value={formData.case_type}
                            onValueChange={value => handleInputChange("case_type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select case type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HOUSING">Housing</SelectItem>
                                <SelectItem value="LEGAL">Legal</SelectItem>
                                <SelectItem value="MEDICAL">Medical</SelectItem>
                                <SelectItem value="SUPPORT">Support</SelectItem>
                                <SelectItem value="EDUCATION">Education</SelectItem>
                                <SelectItem value="EMPLOYMENT">Employment</SelectItem>
                                <SelectItem value="FINANCIAL">Financial</SelectItem>
                                <SelectItem value="FAMILY_REUNIFICATION">
                                    Family Reunification
                                </SelectItem>
                                <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                                <SelectItem value="MENTAL_HEALTH">Mental Health</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={value => handleInputChange("priority", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="urgency_level">Urgency Level</Label>
                            <Select
                                value={formData.urgency_level}
                                onValueChange={value => handleInputChange("urgency_level", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select urgency..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IMMEDIATE">Immediate (24h)</SelectItem>
                                    <SelectItem value="WITHIN_WEEK">Within a week</SelectItem>
                                    <SelectItem value="WITHIN_MONTH">Within a month</SelectItem>
                                    <SelectItem value="FLEXIBLE">Flexible timeline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={value => handleInputChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="has_due_date"
                                checked={formData.has_due_date}
                                onCheckedChange={handleDueDateToggle}
                            />
                            <Label htmlFor="has_due_date">Set due date</Label>
                        </div>

                        {formData.has_due_date && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.due_date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {formData.due_date
                                            ? format(formData.due_date, "PPP")
                                            : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.due_date}
                                        onSelect={handleDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="estimated_duration">Estimated Duration</Label>
                            <Select
                                value={formData.estimated_duration}
                                onValueChange={value =>
                                    handleInputChange("estimated_duration", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1_DAY">1 Day</SelectItem>
                                    <SelectItem value="1_WEEK">1 Week</SelectItem>
                                    <SelectItem value="2_WEEKS">2 Weeks</SelectItem>
                                    <SelectItem value="1_MONTH">1 Month</SelectItem>
                                    <SelectItem value="3_MONTHS">3 Months</SelectItem>
                                    <SelectItem value="6_MONTHS">6 Months</SelectItem>
                                    <SelectItem value="1_YEAR">1 Year</SelectItem>
                                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="budget_allocated">Budget Allocated</Label>
                            <Input
                                id="budget_allocated"
                                placeholder="e.g. $500"
                                value={formData.budget_allocated}
                                onChange={e =>
                                    handleInputChange("budget_allocated", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the case details, background, and any relevant information..."
                            value={formData.description}
                            onChange={e => handleInputChange("description", e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaUserTie /> Assignment
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="beneficiary_id">Beneficiary *</Label>
                        <Select
                            value={formData.beneficiary_id}
                            onValueChange={value => handleInputChange("beneficiary_id", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select beneficiary..." />
                            </SelectTrigger>
                            <SelectContent>
                                {beneficiaries.map(beneficiary => (
                                    <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                        {beneficiary.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="assigned_to_id">Assign to User</Label>
                        <Select
                            value={formData.assigned_to_id}
                            onValueChange={value => handleInputChange("assigned_to_id", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select user..." />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaTags /> Tags & Classification
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="Write tags separated by commas, e.g. urgent, family, medical"
                            onChange={handleTagsChange(setTags)}
                        />
                        <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                            {tags?.map((tag, index) => (
                                <Badge variant="outline" key={index}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-max flex flex-col gap-6">
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaFileAlt /> Documents
                        </h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addNewDocument}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Document
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="documents">Upload Documents</Label>
                        <Input
                            id="documents"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                            onChange={handleDocumentChange}
                            className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-500">
                            Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                        </p>
                    </div>

                    {formData.documents.length > 0 && (
                        <div className="space-y-4">
                            <Label>Document Details</Label>
                            {formData.documents.map((doc, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border rounded-lg space-y-3 ${doc.isFinalized ? "border-green-200 bg-green-50/30" : "border-gray-200"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            {doc.file.name} (
                                            {(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {doc.isFinalized && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-green-600 border-green-600"
                                                >
                                                    Finalized
                                                </Badge>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeDocument(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {!doc.isFinalized ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <Label htmlFor={`doc-name-${index}`}>
                                                        Document Name
                                                    </Label>
                                                    <Input
                                                        id={`doc-name-${index}`}
                                                        value={doc.name}
                                                        onChange={e =>
                                                            updateDocument(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter document name"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`doc-type-${index}`}>
                                                        Document Type
                                                    </Label>
                                                    <Select
                                                        value={doc.type}
                                                        onValueChange={value =>
                                                            updateDocument(index, "type", value)
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="FORM">
                                                                Form
                                                            </SelectItem>
                                                            <SelectItem value="REPORT">
                                                                Report
                                                            </SelectItem>
                                                            <SelectItem value="EVIDENCE">
                                                                Evidence
                                                            </SelectItem>
                                                            <SelectItem value="CORRESPONDENCE">
                                                                Correspondence
                                                            </SelectItem>
                                                            <SelectItem value="IDENTIFICATION">
                                                                Identification
                                                            </SelectItem>
                                                            <SelectItem value="LEGAL">
                                                                Legal Document
                                                            </SelectItem>
                                                            <SelectItem value="MEDICAL">
                                                                Medical Document
                                                            </SelectItem>
                                                            <SelectItem value="OTHER">
                                                                Other
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor={`doc-description-${index}`}>
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id={`doc-description-${index}`}
                                                    value={doc.description}
                                                    onChange={e =>
                                                        updateDocument(
                                                            index,
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Brief description of the document"
                                                    rows={2}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`doc-tags-${index}`}>
                                                    Tags (comma separated)
                                                </Label>
                                                <Input
                                                    id={`doc-tags-${index}`}
                                                    value={doc.tags.join(", ")}
                                                    onChange={e => {
                                                        const tags = e.target.value
                                                            .split(",")
                                                            .map(tag => tag.trim())
                                                            .filter(tag => tag);
                                                        updateDocument(index, "tags", tags);
                                                    }}
                                                    placeholder="e.g. important, legal, housing"
                                                />
                                                {doc.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {doc.tags.map((tag, tagIndex) => (
                                                            <Badge
                                                                variant="outline"
                                                                key={tagIndex}
                                                                className="text-xs"
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => finalizeDocument(index)}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Finalize Document
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="font-medium">Name:</span>{" "}
                                                    {doc.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Type:</span>{" "}
                                                    {doc.type}
                                                </div>
                                            </div>
                                            {doc.description && (
                                                <div className="text-sm">
                                                    <span className="font-medium">
                                                        Description:
                                                    </span>{" "}
                                                    {doc.description}
                                                </div>
                                            )}
                                            {doc.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {doc.tags.map((tag, tagIndex) => (
                                                        <Badge
                                                            variant="outline"
                                                            key={tagIndex}
                                                            className="text-xs"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => editDocument(index)}
                                                className="mt-2"
                                            >
                                                Edit Document
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaStickyNote /> Initial Note
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="note_title">Note Title</Label>
                        <Input
                            id="note_title"
                            value={formData.initial_note.title}
                            onChange={e => handleNoteChange("title", e.target.value)}
                            placeholder="e.g. Case creation details"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="note_content">Note Content</Label>
                        <Textarea
                            id="note_content"
                            value={formData.initial_note.content}
                            onChange={e => handleNoteChange("content", e.target.value)}
                            placeholder="Add any initial observations, next steps, or important information..."
                            rows={3}
                        />
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="note_type">Note Type</Label>
                            <Select
                                value={formData.initial_note.note_type}
                                onValueChange={value => handleNoteChange("note_type", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CALL">Call</SelectItem>
                                    <SelectItem value="MEETING">Meeting</SelectItem>
                                    <SelectItem value="UPDATE">Update</SelectItem>
                                    <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="note_tags">Note Tags</Label>
                            <Input
                                id="note_tags"
                                value={noteTags.join(", ")}
                                onChange={handleNoteTagsChange}
                                placeholder="follow-up, initial, assessment"
                            />
                        </div>
                    </div>

                    {noteTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                            {noteTags?.map((tag, index) => (
                                <Badge variant="outline" key={index} className="text-xs">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="note_important"
                            checked={formData.initial_note.is_important}
                            onCheckedChange={checked =>
                                handleNoteChange("is_important", checked as boolean)
                            }
                        />
                        <Label htmlFor="note_important" className="flex items-center gap-1">
                            <FaFlag className="w-3 h-3 text-red-500" />
                            Mark as important
                        </Label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            const casesPath = pathname.replace("/create", "");
                            router.push(casesPath);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isFormValid || isLoading}>
                        {isLoading ? "Creating..." : "Create Case"}
                    </Button>
                </div>
            </div>
        </form>
    );
};
