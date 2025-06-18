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
    createCaseNote,
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
    service_types: string[];
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

const CASE_TAG_OPTIONS = [
    { code: 'CR', label: 'Child at risk' },
    { code: 'CR-CP', label: 'Child parent' },
    { code: 'CR-CS', label: 'Child spouse' },
    { code: 'CR-CC', label: 'Child carer' },
    { code: 'CR-TP', label: 'Teenage pregnancy' },
    { code: 'CR-LW', label: 'Child engaged in worst forms of child labour' },
    { code: 'CR-LO', label: 'Child engaged in other forms of child labour' },
    { code: 'CR-NE', label: 'Child at risk of not attending school' },
    { code: 'CR-SE', label: 'Child with special education needs' },
    { code: 'CR-AF', label: 'Child associated with armed forces or groups' },
    { code: 'CR-CL', label: 'Child in conflict with the law' },
    { code: 'SC', label: 'Unaccompanied or separated child' },
    { code: 'SC-SC', label: 'Separated child' },
    { code: 'SC-UC', label: 'Unaccompanied child' },
    { code: 'SC-CH', label: 'Child-headed household' },
    { code: 'SC-IC', label: 'Child in institutional care' },
    { code: 'SC-FC', label: 'Child in foster care' },
    { code: 'WR', label: 'Woman at risk' },
    { code: 'WR-WR', label: 'Woman at risk' },
    { code: 'WR-SF', label: 'Single woman at risk' },
    { code: 'WR-LC', label: 'Lactation' },
    { code: 'ER', label: 'Older person at risk' },
    { code: 'ER-NF', label: 'Single older person' },
    { code: 'ER-MC', label: 'Older person with children' },
    { code: 'ER-FR', label: 'Older person unable to care for self' },
    { code: 'SP', label: 'Single parent or caregiver' },
    { code: 'SP-PT', label: 'Single HR – parent' },
    { code: 'SP-GP', label: 'Single HR – grandparent' },
    { code: 'SP-CG', label: 'Single HR – caregiver' },
    { code: 'DS', label: 'Disability' },
    { code: 'DS-BD', label: 'Visual impairment (including blindness)' },
    { code: 'DS-DF', label: 'Hearing impairment (including deafness)' },
    { code: 'DS-PM', label: 'Physical disability – moderate' },
    { code: 'DS-PS', label: 'Physical disability – severe' },
    { code: 'DS-MM', label: 'Mental disability – moderate' },
    { code: 'DS-MS', label: 'Mental disability – severe' },
    { code: 'DS-SD', label: 'Speech impairment/disability' },
    { code: 'SM', label: 'Serious medical condition' },
    { code: 'SM-MI', label: 'Mental illness' },
    { code: 'SM-MN', label: 'Malnutrition' },
    { code: 'SM-DP', label: 'Difficult pregnancy' },
    { code: 'SM-CI', label: 'Chronic illness' },
    { code: 'SM-CC', label: 'Critical medical condition' },
    { code: 'SM-OT', label: 'Other medical condition' },
    { code: 'SM-AD', label: 'Addiction' },
    { code: 'FU', label: 'Family unity' },
    { code: 'FU-TR', label: 'Tracing required' },
    { code: 'FU-FR', label: 'Family reunification required' },
    { code: 'LP', label: 'Specific legal and physical protection needs' },
    { code: 'LP-ND', label: 'No legal documentation' },
    { code: 'LP-BN', label: 'Unmet basic needs' },
    { code: 'LP-NA', label: 'No access to services' },
    { code: 'LP-MM', label: 'Mixed marriage' },
    { code: 'LP-MD', label: 'Multiple displacements' },
    { code: 'LP-RR', label: 'At risk of refoulement' },
    { code: 'LP-RD', label: 'At risk of removal' },
    { code: 'LP-DA', label: 'Detained in country of asylum' },
    { code: 'LP-DO', label: 'Detained in country of origin' },
    { code: 'LP-DT', label: 'Detained elsewhere' },
    { code: 'LP-IH', label: 'In hiding' },
    { code: 'LP-WP', label: 'Absence of witness protection' },
    { code: 'LP-AN', label: 'Violence, abuse or neglect' },
    { code: 'LP-RP', label: 'At risk due to profile' },
    { code: 'LP-MS', label: 'Marginalized from society/community' },
    { code: 'LP-LS', label: 'Lack of durable solutions prospects' },
    { code: 'LP-AP', label: 'Alleged perpetrator' },
    { code: 'LP-CR', label: 'Criminal record' },
    { code: 'LP-ST', label: 'Security threat to UNHCR/partner staff' },
    { code: 'LP-AF', label: 'Formerly associated with armed forces/groups' },
    { code: 'TR', label: 'Torture' },
    { code: 'TR-PI', label: 'Psychological/physical impairment due to torture' },
    { code: 'TR-HO', label: 'Forced to egregious acts' },
    { code: 'TR-WV', label: 'Witness of violence to other' },
    { code: 'SV', label: 'SGBV' },
    { code: 'SV-VA', label: 'Victim/survivor of SGBV in country of asylum' },
    { code: 'SV-VF', label: 'Victim/survivor of SGBV during flight' },
    { code: 'SV-VO', label: 'Victim/survivor of SGBV in country of origin' },
    { code: 'SV-GM', label: 'Female genital mutilation' },
    { code: 'SV-HP', label: 'Harmful traditional practices' },
    { code: 'SV-HK', label: 'Threat of honour killing/violence' },
    { code: 'SV-FM', label: 'Forced/early marriage' },
    { code: 'SV-SS', label: 'Survival sex' },
];

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
    const [tagSearch, setTagSearch] = useState("");

    const [formData, setFormData] = useState<CaseFormData>({
        title: "",
        description: "",
        service_types: [],
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
        value: string | boolean | Date | undefined | string[]
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
                service_types: formData.service_types as CreateCasePayload["service_types"],
                priority: formData.priority as CreateCasePayload["priority"],
                urgency_level: formData.urgency_level
                    ? (formData.urgency_level as CreateCasePayload["urgency_level"])
                    : undefined,
                due_date: formData.due_date ? formData.due_date.toISOString() : undefined,
                estimated_duration: formData.estimated_duration || undefined,
                budget_allocated: formData.budget_allocated || undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
            };

            // Create the case
            console.log("🏗️ Creating case with payload:", casePayload);
            const response = await createCase(casePayload);
            const newCaseId = response.data.id;
            console.log("✅ Case created with ID:", newCaseId);

            // Create initial note only if provided and backend doesn't handle it automatically
            if (formData.initial_note.title || formData.initial_note.content) {
                try {
                    console.log("📝 Creating initial note...");
                    const notePayload = {
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
                    
                    const noteResponse = await createCaseNote(newCaseId, notePayload);
                    console.log("✅ Initial note created:", noteResponse);
                } catch (noteError: any) {
                    console.warn("⚠️ Failed to create initial note:", noteError);
                    // Don't fail the entire case creation if note creation fails
                }
            }

            // Handle document uploads if any documents were added
            if (formData.documents.length > 0) {
                console.log(`📄 Uploading ${formData.documents.length} documents for case ${newCaseId}`);
                
                for (const doc of formData.documents) {
                    try {
                        console.log(`📤 Starting upload for document: ${doc.name}`);
                        
                        // Step 1: Get presigned upload URL
                        console.log("🔗 Getting presigned upload URL...");
                        const uploadLinkResponse = await generateCaseDocumentUploadLink(
                            newCaseId,
                            doc.file.type
                        );
                        const uploadLinkData = uploadLinkResponse.data;
                        console.log("✅ Got presigned URL:", uploadLinkData);

                        // Step 2: Upload directly to S3
                        console.log("☁️ Uploading to S3...");
                        const s3Response = await fetch(uploadLinkData.link, {
                            method: "PUT",
                            headers: {
                                "Content-Type": doc.file.type,
                            },
                            body: doc.file,
                        });

                        if (!s3Response.ok) {
                            throw new Error(`S3 upload failed: ${s3Response.status} ${s3Response.statusText}`);
                        }
                        console.log("✅ S3 upload successful");

                        // Step 3: Extract file key and save metadata
                        console.log("💾 Saving document metadata...");
                        const fileKey = extractFileKeyFromS3Url(uploadLinkData.link);

                        const documentData = {
                            document_name: doc.name,
                            document_type: doc.type,
                            description: doc.description,
                            tags: doc.tags,
                            file_name: doc.file.name,
                            file_size: doc.file.size,
                            mime_type: doc.file.type,
                            file_key: fileKey,
                        };

                        const createDocResponse = await createCaseDocument(newCaseId, documentData);
                        console.log("✅ Document metadata saved:", createDocResponse);
                    } catch (docError: any) {
                        console.error(`❌ Error uploading document ${doc.name}:`, {
                            error: docError,
                            message: docError?.message,
                            response: docError?.response?.data,
                            status: docError?.response?.status,
                            documentName: doc.name,
                            fileType: doc.file.type,
                            fileSize: doc.file.size
                        });
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
        } catch (error: any) {
            console.error("❌ Error creating case:", {
                error,
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                formData: {
                    title: formData.title,
                    service_types: formData.service_types,
                    priority: formData.priority,
                    beneficiary_id: formData.beneficiary_id,
                    documentsCount: formData.documents.length
                }
            });
            
            let errorMessage = "Failed to create case. Please try again.";
            let shouldRedirect = false;

            // Check if it's a CORS/Network error
            if (error?.message?.includes('CORS') || 
                error?.message?.includes('Network Error') || 
                error?.code === 'ERR_NETWORK') {
                console.log("⚠️ CORS/Network error detected, but case might have been created");
                errorMessage = "The case might have been created, but we couldn't confirm. Please check the cases list.";
                shouldRedirect = true;
            } else if (error?.response?.status === 400) {
                errorMessage = "Invalid case data. Please check your inputs.";
            } else if (error?.response?.status === 403) {
                errorMessage = "You don't have permission to create cases.";
            } else if (error?.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast({
                title: shouldRedirect ? "Warning" : "Error",
                description: errorMessage,
                variant: shouldRedirect ? "default" : "destructive",
            });

            // If it's a CORS/Network error, redirect anyway since the case was likely created
            if (shouldRedirect) {
                const casesPath = pathname.replace("/create", "");
                router.push(casesPath);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        formData.title && formData.service_types.length > 0 && formData.priority && formData.beneficiary_id;

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
                        <Label htmlFor="service_types">Service Types *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        formData.service_types.length === 0 && "text-muted-foreground"
                                    )}
                                >
                                    {formData.service_types.length === 0 
                                        ? "Select service types..." 
                                        : `${formData.service_types.length} service type(s) selected`}
                                    <div className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                                    {[
                                        { value: "CHILD_PROTECTION_CASE_MANAGEMENT", label: "Child Protection Case Management" },
                                        { value: "GBV_CASE_MANAGEMENT", label: "Gender-Based Violence (GBV) Case Management" },
                                        { value: "GENERAL_PROTECTION_SERVICES", label: "General Protection Services" },
                                        { value: "SEXUAL_VIOLENCE_RESPONSE", label: "Sexual Violence Response" },
                                        { value: "INTIMATE_PARTNER_VIOLENCE_SUPPORT", label: "Intimate Partner Violence Support" },
                                        { value: "HUMAN_TRAFFICKING_RESPONSE", label: "Human Trafficking Response" },
                                        { value: "FAMILY_SEPARATION_REUNIFICATION", label: "Family Separation and Reunification" },
                                        { value: "UASC_SERVICES", label: "Unaccompanied and Separated Children (UASC) Services" },
                                        { value: "MHPSS", label: "Mental Health and Psychosocial Support (MHPSS)" },
                                        { value: "LEGAL_AID_ASSISTANCE", label: "Legal Aid and Assistance" },
                                        { value: "CIVIL_DOCUMENTATION_SUPPORT", label: "Civil Documentation Support" },
                                        { value: "EMERGENCY_SHELTER_HOUSING", label: "Emergency Shelter and Housing" },
                                        { value: "NFI_DISTRIBUTION", label: "Non-Food Items (NFI) Distribution" },
                                        { value: "FOOD_SECURITY_NUTRITION", label: "Food Security and Nutrition" },
                                        { value: "CVA", label: "Cash and Voucher Assistance (CVA)" },
                                        { value: "WASH", label: "Water, Sanitation and Hygiene (WASH)" },
                                        { value: "HEALTHCARE_SERVICES", label: "Healthcare Services" },
                                        { value: "EMERGENCY_MEDICAL_CARE", label: "Emergency Medical Care" },
                                        { value: "SEXUAL_REPRODUCTIVE_HEALTH", label: "Sexual and Reproductive Health Services" },
                                        { value: "DISABILITY_SUPPORT_SERVICES", label: "Disability Support Services" },
                                        { value: "EMERGENCY_EVACUATION", label: "Emergency Evacuation" },
                                        { value: "SEARCH_RESCUE_COORDINATION", label: "Search and Rescue Coordination" },
                                        { value: "RAPID_ASSESSMENT_NEEDS_ANALYSIS", label: "Rapid Assessment and Needs Analysis" },
                                        { value: "EMERGENCY_REGISTRATION", label: "Emergency Registration" },
                                        { value: "EMERGENCY_TRANSPORTATION", label: "Emergency Transportation" },
                                        { value: "EMERGENCY_COMMUNICATION_SERVICES", label: "Emergency Communication Services" },
                                        { value: "EMERGENCY_EDUCATION_SERVICES", label: "Emergency Education Services" },
                                        { value: "CHILD_FRIENDLY_SPACES", label: "Child-Friendly Spaces" },
                                        { value: "SKILLS_TRAINING_VOCATIONAL_EDUCATION", label: "Skills Training and Vocational Education" },
                                        { value: "LITERACY_PROGRAMS", label: "Literacy Programs" },
                                        { value: "AWARENESS_PREVENTION_CAMPAIGNS", label: "Awareness and Prevention Campaigns" },
                                        { value: "LIVELIHOOD_SUPPORT_PROGRAMS", label: "Livelihood Support Programs" },
                                        { value: "MICROFINANCE_CREDIT_SERVICES", label: "Microfinance and Credit Services" },
                                        { value: "JOB_PLACEMENT_EMPLOYMENT_SERVICES", label: "Job Placement and Employment Services" },
                                        { value: "AGRICULTURAL_SUPPORT", label: "Agricultural Support" },
                                        { value: "BUSINESS_DEVELOPMENT_SUPPORT", label: "Business Development Support" },
                                        { value: "REFUGEE_SERVICES", label: "Refugee Services" },
                                        { value: "IDP_SERVICES", label: "Internally Displaced Person (IDP) Services" },
                                        { value: "RETURNEE_REINTEGRATION_SERVICES", label: "Returnee and Reintegration Services" },
                                        { value: "HOST_COMMUNITY_SUPPORT", label: "Host Community Support" },
                                        { value: "ELDERLY_CARE_SERVICES", label: "Elderly Care Services" },
                                        { value: "SERVICES_FOR_PERSONS_WITH_DISABILITIES", label: "Services for Persons with Disabilities" },
                                        { value: "CASE_REFERRAL_TRANSFER", label: "Case Referral and Transfer" },
                                        { value: "INTER_AGENCY_COORDINATION", label: "Inter-agency Coordination" },
                                        { value: "SERVICE_MAPPING_INFORMATION", label: "Service Mapping and Information" },
                                        { value: "FOLLOW_UP_MONITORING", label: "Follow-up and Monitoring" },
                                        { value: "CASE_CLOSURE_TRANSITION", label: "Case Closure and Transition" },
                                        { value: "BIRTH_REGISTRATION", label: "Birth Registration" },
                                        { value: "IDENTITY_DOCUMENTATION", label: "Identity Documentation" },
                                        { value: "LEGAL_COUNSELING", label: "Legal Counseling" },
                                        { value: "COURT_SUPPORT_ACCOMPANIMENT", label: "Court Support and Accompaniment" },
                                        { value: "DETENTION_MONITORING", label: "Detention Monitoring" },
                                        { value: "ADVOCACY_SERVICES", label: "Advocacy Services" },
                                        { value: "PRIMARY_HEALTHCARE", label: "Primary Healthcare" },
                                        { value: "CLINICAL_MANAGEMENT_RAPE", label: "Clinical Management of Rape (CMR)" },
                                        { value: "HIV_AIDS_PREVENTION_TREATMENT", label: "HIV/AIDS Prevention and Treatment" },
                                        { value: "TUBERCULOSIS_TREATMENT", label: "Tuberculosis Treatment" },
                                        { value: "MALNUTRITION_TREATMENT", label: "Malnutrition Treatment" },
                                        { value: "VACCINATION_PROGRAMS", label: "Vaccination Programs" },
                                        { value: "EMERGENCY_SURGERY", label: "Emergency Surgery" },
                                        { value: "CAMP_COORDINATION_MANAGEMENT", label: "Camp Coordination and Camp Management" },
                                        { value: "MINE_ACTION_SERVICES", label: "Mine Action Services" },
                                        { value: "PEACEKEEPING_PEACEBUILDING", label: "Peacekeeping and Peacebuilding" },
                                        { value: "LOGISTICS_TELECOMMUNICATIONS", label: "Logistics and Telecommunications" },
                                        { value: "INFORMATION_MANAGEMENT", label: "Information Management" },
                                        { value: "COMMUNITY_MOBILIZATION", label: "Community Mobilization" },
                                        { value: "WINTERIZATION_SUPPORT", label: "Winterization Support" }
                                    ].map((serviceType) => (
                                        <div key={serviceType.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={serviceType.value}
                                                checked={formData.service_types.includes(serviceType.value)}
                                                onCheckedChange={(checked) => {
                                                    const newServiceTypes = checked
                                                        ? [...formData.service_types, serviceType.value]
                                                        : formData.service_types.filter(type => type !== serviceType.value);
                                                    handleInputChange("service_types", newServiceTypes);
                                                }}
                                            />
                                            <Label htmlFor={serviceType.value} className="text-sm font-normal">
                                                {serviceType.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                        {formData.service_types.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {formData.service_types.map((type) => {
                                    // Find the label for this service type
                                    const serviceTypeOptions = [
                                        { value: "CHILD_PROTECTION_CASE_MANAGEMENT", label: "Child Protection Case Management" },
                                        { value: "GBV_CASE_MANAGEMENT", label: "Gender-Based Violence (GBV) Case Management" },
                                        { value: "GENERAL_PROTECTION_SERVICES", label: "General Protection Services" },
                                        { value: "SEXUAL_VIOLENCE_RESPONSE", label: "Sexual Violence Response" },
                                        { value: "INTIMATE_PARTNER_VIOLENCE_SUPPORT", label: "Intimate Partner Violence Support" },
                                        { value: "HUMAN_TRAFFICKING_RESPONSE", label: "Human Trafficking Response" },
                                        { value: "FAMILY_SEPARATION_REUNIFICATION", label: "Family Separation and Reunification" },
                                        { value: "UASC_SERVICES", label: "Unaccompanied and Separated Children (UASC) Services" },
                                        { value: "MHPSS", label: "Mental Health and Psychosocial Support (MHPSS)" },
                                        { value: "LEGAL_AID_ASSISTANCE", label: "Legal Aid and Assistance" },
                                        { value: "CIVIL_DOCUMENTATION_SUPPORT", label: "Civil Documentation Support" },
                                        { value: "EMERGENCY_SHELTER_HOUSING", label: "Emergency Shelter and Housing" },
                                        { value: "NFI_DISTRIBUTION", label: "Non-Food Items (NFI) Distribution" },
                                        { value: "FOOD_SECURITY_NUTRITION", label: "Food Security and Nutrition" },
                                        { value: "CVA", label: "Cash and Voucher Assistance (CVA)" },
                                        { value: "WASH", label: "Water, Sanitation and Hygiene (WASH)" },
                                        { value: "HEALTHCARE_SERVICES", label: "Healthcare Services" },
                                        { value: "EMERGENCY_MEDICAL_CARE", label: "Emergency Medical Care" },
                                        { value: "SEXUAL_REPRODUCTIVE_HEALTH", label: "Sexual and Reproductive Health Services" },
                                        { value: "DISABILITY_SUPPORT_SERVICES", label: "Disability Support Services" },
                                        { value: "EMERGENCY_EVACUATION", label: "Emergency Evacuation" },
                                        { value: "SEARCH_RESCUE_COORDINATION", label: "Search and Rescue Coordination" },
                                        { value: "RAPID_ASSESSMENT_NEEDS_ANALYSIS", label: "Rapid Assessment and Needs Analysis" },
                                        { value: "EMERGENCY_REGISTRATION", label: "Emergency Registration" },
                                        { value: "EMERGENCY_TRANSPORTATION", label: "Emergency Transportation" },
                                        { value: "EMERGENCY_COMMUNICATION_SERVICES", label: "Emergency Communication Services" },
                                        { value: "EMERGENCY_EDUCATION_SERVICES", label: "Emergency Education Services" },
                                        { value: "CHILD_FRIENDLY_SPACES", label: "Child-Friendly Spaces" },
                                        { value: "SKILLS_TRAINING_VOCATIONAL_EDUCATION", label: "Skills Training and Vocational Education" },
                                        { value: "LITERACY_PROGRAMS", label: "Literacy Programs" },
                                        { value: "AWARENESS_PREVENTION_CAMPAIGNS", label: "Awareness and Prevention Campaigns" },
                                        { value: "LIVELIHOOD_SUPPORT_PROGRAMS", label: "Livelihood Support Programs" },
                                        { value: "MICROFINANCE_CREDIT_SERVICES", label: "Microfinance and Credit Services" },
                                        { value: "JOB_PLACEMENT_EMPLOYMENT_SERVICES", label: "Job Placement and Employment Services" },
                                        { value: "AGRICULTURAL_SUPPORT", label: "Agricultural Support" },
                                        { value: "BUSINESS_DEVELOPMENT_SUPPORT", label: "Business Development Support" },
                                        { value: "REFUGEE_SERVICES", label: "Refugee Services" },
                                        { value: "IDP_SERVICES", label: "Internally Displaced Person (IDP) Services" },
                                        { value: "RETURNEE_REINTEGRATION_SERVICES", label: "Returnee and Reintegration Services" },
                                        { value: "HOST_COMMUNITY_SUPPORT", label: "Host Community Support" },
                                        { value: "ELDERLY_CARE_SERVICES", label: "Elderly Care Services" },
                                        { value: "SERVICES_FOR_PERSONS_WITH_DISABILITIES", label: "Services for Persons with Disabilities" },
                                        { value: "CASE_REFERRAL_TRANSFER", label: "Case Referral and Transfer" },
                                        { value: "INTER_AGENCY_COORDINATION", label: "Inter-agency Coordination" },
                                        { value: "SERVICE_MAPPING_INFORMATION", label: "Service Mapping and Information" },
                                        { value: "FOLLOW_UP_MONITORING", label: "Follow-up and Monitoring" },
                                        { value: "CASE_CLOSURE_TRANSITION", label: "Case Closure and Transition" },
                                        { value: "BIRTH_REGISTRATION", label: "Birth Registration" },
                                        { value: "IDENTITY_DOCUMENTATION", label: "Identity Documentation" },
                                        { value: "LEGAL_COUNSELING", label: "Legal Counseling" },
                                        { value: "COURT_SUPPORT_ACCOMPANIMENT", label: "Court Support and Accompaniment" },
                                        { value: "DETENTION_MONITORING", label: "Detention Monitoring" },
                                        { value: "ADVOCACY_SERVICES", label: "Advocacy Services" },
                                        { value: "PRIMARY_HEALTHCARE", label: "Primary Healthcare" },
                                        { value: "CLINICAL_MANAGEMENT_RAPE", label: "Clinical Management of Rape (CMR)" },
                                        { value: "HIV_AIDS_PREVENTION_TREATMENT", label: "HIV/AIDS Prevention and Treatment" },
                                        { value: "TUBERCULOSIS_TREATMENT", label: "Tuberculosis Treatment" },
                                        { value: "MALNUTRITION_TREATMENT", label: "Malnutrition Treatment" },
                                        { value: "VACCINATION_PROGRAMS", label: "Vaccination Programs" },
                                        { value: "EMERGENCY_SURGERY", label: "Emergency Surgery" },
                                        { value: "CAMP_COORDINATION_MANAGEMENT", label: "Camp Coordination and Camp Management" },
                                        { value: "MINE_ACTION_SERVICES", label: "Mine Action Services" },
                                        { value: "PEACEKEEPING_PEACEBUILDING", label: "Peacekeeping and Peacebuilding" },
                                        { value: "LOGISTICS_TELECOMMUNICATIONS", label: "Logistics and Telecommunications" },
                                        { value: "INFORMATION_MANAGEMENT", label: "Information Management" },
                                        { value: "COMMUNITY_MOBILIZATION", label: "Community Mobilization" },
                                        { value: "WINTERIZATION_SUPPORT", label: "Winterization Support" }
                                    ];
                                    const serviceTypeLabel = serviceTypeOptions.find(option => option.value === type)?.label || type;
                                    
                                    return (
                                        <Badge key={type} variant="secondary" className="text-xs">
                                            {serviceTypeLabel}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newServiceTypes = formData.service_types.filter(t => t !== type);
                                                    handleInputChange("service_types", newServiceTypes);
                                                }}
                                                className="ml-1 text-xs hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
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
                        <Label htmlFor="assigned_to_id">Assign to User *</Label>
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
                        <Label htmlFor="case-tags">Case Tags</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        formData.tags.length === 0 && "text-muted-foreground"
                                    )}
                                >
                                    {formData.tags.length === 0 
                                        ? "Select one or more tags..." 
                                        : `${formData.tags.length} tag(s) selected`}
                                    <div className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-2">
                                <Input
                                    placeholder="Search tags..."
                                    className="mb-2"
                                    value={tagSearch}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearch(e.target.value)}
                                />
                                <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                                    {CASE_TAG_OPTIONS.filter(opt =>
                                        !formData.tags.includes(opt.code) &&
                                        (tagSearch === "" ||
                                            opt.code.toLowerCase().includes(tagSearch.toLowerCase()) ||
                                            opt.label.toLowerCase().includes(tagSearch.toLowerCase()))
                                    ).map(option => (
                                        <Button
                                            key={option.code}
                                            variant="ghost"
                                            className="w-full justify-start text-left"
                                            onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, option.code] }))}
                                        >
                                            <span className="font-mono text-xs mr-2">{option.code}</span>
                                            {option.label}
                                        </Button>
                                    ))}
                                    {CASE_TAG_OPTIONS.filter(opt =>
                                        !formData.tags.includes(opt.code) &&
                                        (tagSearch === "" ||
                                            opt.code.toLowerCase().includes(tagSearch.toLowerCase()) ||
                                            opt.label.toLowerCase().includes(tagSearch.toLowerCase()))
                                    ).length === 0 && (
                                        <span className="text-xs text-muted-foreground">No tags found</span>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 items-start p-3 bg-gray-50 border border-gray-200 rounded-md max-w-full">
                                {formData.tags.map(code => {
                                    const tag = CASE_TAG_OPTIONS.find(opt => opt.code === code);
                                    return tag ? (
                                        <Badge key={code} variant="secondary" className="text-xs bg-slate-100 text-slate-700 break-words">
                                            {tag.code} - {tag.label}
                                            <X
                                                className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        tags: prev.tags.filter(t => t !== code),
                                                    }));
                                                }}
                                            />
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        )}
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
                                                    <div className="flex flex-wrap gap-2 items-start min-h-[40px] mt-2">
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
                                                <div className="flex flex-wrap gap-2 items-start min-h-[40px] mt-2">
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
