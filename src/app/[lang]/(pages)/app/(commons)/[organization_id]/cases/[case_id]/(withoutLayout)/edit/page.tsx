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
import { CalendarDays } from "lucide-react";
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

const EditCasePage = (): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiarySchema[]>([]);
    const [users, setUsers] = useState<UserSchema[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        case_type: "",
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
                        case_type: caseData.case_type,
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
                    setTags(caseData.tags || []);
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

    const handleInputChange = (field: string, value: string | boolean | Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const values = event.target.value
            .split(",")
            .map(value => value.trim())
            .filter(value => value);
        setTags(values);
        setFormData(prev => ({
            ...prev,
            tags: values,
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
                case_type: formData.case_type as UpdateCasePayload["case_type"],
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

    const isFormValid = formData.title && formData.case_type && formData.priority;

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
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                placeholder="Write tags separated by commas, e.g. urgent, family, medical"
                                value={tags.join(", ")}
                                onChange={handleTagsChange}
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
