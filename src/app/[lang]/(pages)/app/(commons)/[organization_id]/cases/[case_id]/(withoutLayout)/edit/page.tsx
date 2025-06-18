"use client";

import { ReactNode, useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    FaFileAlt,
    FaUsers,
    FaTag,
    FaStickyNote,
    FaFlag,
    FaUserTie,
    FaTags,
    FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import {
    getBeneficiariesByOrganizationID,
    findUsersByOrganizationId,
    updateCase,
    getCaseById,
} from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { UserSchema } from "@/types/user.types";
import { UpdateCasePayload } from "@/types/case.types";
import { useToast } from "@/components/ui/use-toast";

const SERVICE_TYPE_OPTIONS = [
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
    { value: "WINTERIZATION_SUPPORT", label: "Winterization Support" },
];

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

const EditCasePage = (): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tagSearch, setTagSearch] = useState("");
    const [beneficiaries, setBeneficiaries] = useState<BeneficiarySchema[]>([]);
    const [users, setUsers] = useState<UserSchema[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        service_types: [] as string[],
        status: "",
        priority: "",
        urgency_level: "",
        estimated_duration: "",
        budget_allocated: "",
        tags: [] as string[],
        due_date: undefined as Date | undefined,
        has_due_date: false,
        beneficiary_id: "",
        assigned_to_id: "",
    });

    const caseId = pathname.split("/")[5];
    const backPath = pathname.replace("/edit", "");

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                if (caseId) {
                    const response = await getCaseById(caseId);
                    const caseData = response.data;
                    const dueDate = caseData.due_date ? new Date(caseData.due_date) : undefined;

                    setFormData({
                        title: caseData.title,
                        description: caseData.description,
                        service_types: caseData.service_types || [],
                        status: caseData.status,
                        priority: caseData.priority,
                        urgency_level: caseData.urgency_level || "",
                        estimated_duration: caseData.estimated_duration || "",
                        budget_allocated: caseData.budget_allocated || "",
                        tags: caseData.tags || [],
                        due_date: dueDate,
                        has_due_date: !!caseData.due_date,
                        beneficiary_id: caseData.beneficiary_id,
                        assigned_to_id: caseData.assigned_to_id,
                    });
                }
            } catch (error) {
                console.error("Error fetching case data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId]);

    // Load beneficiaries and users
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

    const handleInputChange = (field: string, value: string | boolean | Date | undefined | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const addTag = (tagCode: string) => {
        if (!formData.tags.includes(tagCode)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagCode],
            }));
        }
    };

    const removeTag = (tagCode: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagCode),
        }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (!caseId) {
                toast({
                    title: "Error",
                    description: "Case ID not found",
                    variant: "destructive",
                });
                return;
            }

            // Prepare the update payload according to UpdateCasePayload interface
            // Note: beneficiary_id is not included as it cannot be changed once assigned
            const updatePayload: UpdateCasePayload = {
                title: formData.title,
                description: formData.description,
                service_types: formData.service_types as UpdateCasePayload["service_types"],
                status: formData.status as UpdateCasePayload["status"],
                priority: formData.priority as UpdateCasePayload["priority"],
                urgency_level: formData.urgency_level
                    ? (formData.urgency_level as UpdateCasePayload["urgency_level"])
                    : undefined,
                assigned_to_id: formData.assigned_to_id,
                due_date: formData.due_date ? formData.due_date.toISOString() : undefined,
                estimated_duration: formData.estimated_duration || undefined,
                budget_allocated: formData.budget_allocated || undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
            };

            console.log("🔄 Updating case with payload:", updatePayload);

            // Update the case
            const updateResponse = await updateCase(caseId, updatePayload);
            console.log("✅ Case update response:", updateResponse);

            toast({
                title: "Success",
                description: "Case updated successfully",
            });

            // Redirect back to case overview
            router.push(backPath);
        } catch (error: any) {
            console.error("❌ Error updating case:", {
                error,
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });

            // More specific error messages
            let errorMessage = "Failed to update case. Please try again.";
            if (error?.response?.status === 400) {
                errorMessage = "Invalid case data. Please check your inputs.";
            } else if (error?.response?.status === 403) {
                errorMessage = "You don't have permission to update this case.";
            } else if (error?.response?.status === 404) {
                errorMessage = "Case not found. It may have been deleted.";
            } else if (error?.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 flex flex-col gap-4 lg:p-2">
                <div className="text-relif-orange-400 font-medium text-sm">
                    Loading case data...
                </div>
            </div>
        );
    }

    const isFormValid = formData.title && formData.service_types.length > 0 && formData.priority;

    return (
        <div className="w-full h-max p-4 flex flex-col gap-4 lg:p-2">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaFileAlt />
                    Edit Case
                </h1>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                        <strong>Important:</strong> Once a case has a beneficiary assigned, the
                        beneficiary cannot be changed to maintain case integrity. You can edit all
                        other case information including the assigned user, status, and details.
                    </p>
                </div>
            </div>

            <form
                className="w-full h-max grid grid-cols-2 gap-4 lg:flex lg:flex-col"
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
                                        {SERVICE_TYPE_OPTIONS.map((serviceType) => (
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
                                        const serviceTypeLabel = SERVICE_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
                                        
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
                                    onValueChange={value =>
                                        handleInputChange("urgency_level", value)
                                    }
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
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                </div>

                <div className="w-full h-max flex flex-col gap-6">
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaUserTie /> Assignment
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="beneficiary_id" className="flex items-center gap-2">
                                <FaUsers className="text-relif-orange-200" />
                                Beneficiary *
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                    Cannot be changed
                                </Badge>
                            </Label>
                            {isLoadingData ? (
                                <div className="text-sm text-slate-500">Loading beneficiary...</div>
                            ) : (
                                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                                    {beneficiaries.find(b => b.id === formData.beneficiary_id)
                                        ?.full_name || "Beneficiary not found"}
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                The beneficiary cannot be changed once assigned to maintain case
                                integrity.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="assigned_to_id" className="flex items-center gap-2">
                                <FaUserTie className="text-relif-orange-200" />
                                Assign to User
                                <Badge
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700"
                                >
                                    Can be changed
                                </Badge>
                            </Label>
                            {isLoadingData ? (
                                <div className="text-sm text-slate-500">Loading users...</div>
                            ) : (
                                <Select
                                    value={formData.assigned_to_id}
                                    onValueChange={value =>
                                        handleInputChange("assigned_to_id", value)
                                    }
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
                            )}
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
                                                onClick={() => addTag(option.code)}
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
                                                    onClick={() => removeTag(code)}
                                                />
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(backPath)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isFormValid || isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditCasePage;
