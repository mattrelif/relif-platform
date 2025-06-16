"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaFileAlt, FaPlus, FaEye, FaClock, FaDollarSign, FaFlag } from "react-icons/fa";
import { getCasesByOrganizationID } from "@/repository/organization.repository";
import { getBeneficiaryById } from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";



// Get cases for a specific beneficiary
const getBeneficiaryCases = async (beneficiaryId: string, organizationId: string): Promise<CaseSchema[]> => {
    try {
        // Get all cases for the organization and filter by beneficiary
        const response = await getCasesByOrganizationID(organizationId, 0, 1000, "");
        const allCases = response.data.data || [];
        
        // Filter cases for this specific beneficiary
        return allCases.filter(caseItem => caseItem.beneficiary_id === beneficiaryId);
    } catch (error) {
        console.error("Error fetching beneficiary cases:", error);
        return [];
    }
};

// Mock function - replace with actual API call  
const getBeneficiaryCasesMock = async (beneficiaryId: string): Promise<CaseSchema[]> => {
    // For now, return empty array - this will be replaced with real API call
    return [];
    
    /* Mock data structure (keeping for reference but commented out due to missing beneficiary object)
    const casesData: { [key: string]: CaseSchema[] } = {
        "ben-001": [
            {
                id: "case-001",
                case_number: "CASE-2024-001",
                title: "Emergency Housing Assistance",
                description: "Urgent housing support needed due to eviction notice. Family with 3 children requires immediate temporary housing and assistance with finding permanent accommodation.",
                status: "IN_PROGRESS",
                priority: "URGENT",
                urgency_level: "IMMEDIATE",
                case_type: "HOUSING",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-001",
                assigned_to: {
                    id: "user-001",
                    first_name: "Sarah",
                    last_name: "Johnson",
                    email: "sarah.johnson@org.com"
                },
                due_date: "2024-02-15",
                estimated_duration: "2_WEEKS",
                budget_allocated: "$1,200",
                tags: ["urgent", "housing", "family", "children", "eviction"],
                notes_count: 12,
                documents_count: 8,
                last_activity: "2024-01-12T16:45:00Z",
                created_at: "2024-01-08T09:00:00Z",
                updated_at: "2024-01-12T16:45:00Z"
            },
            {
                id: "case-002",
                case_number: "CASE-2024-002",
                title: "Medical Insurance Enrollment",
                description: "Assistance with enrolling in state medical insurance program and understanding coverage options for family healthcare needs.",
                status: "OPEN",
                priority: "HIGH",
                urgency_level: "WITHIN_WEEK",
                case_type: "MEDICAL",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-002",
                assigned_to: {
                    id: "user-002",
                    first_name: "Michael",
                    last_name: "Chen",
                    email: "michael.chen@org.com"
                },
                due_date: "2024-02-28",
                estimated_duration: "1_WEEK",
                budget_allocated: "$150",
                tags: ["medical", "insurance", "enrollment", "family"],
                notes_count: 4,
                documents_count: 3,
                last_activity: "2024-01-10T11:20:00Z",
                created_at: "2024-01-09T14:30:00Z",
                updated_at: "2024-01-10T11:20:00Z"
            }
        ],
        "ben-002": [
            {
                id: "case-003",
                case_number: "CASE-2024-003",
                title: "Immigration Status Documentation",
                description: "Support with gathering and organizing immigration documents for asylum application. Includes translation services and legal consultation coordination.",
                status: "IN_PROGRESS",
                priority: "HIGH",
                urgency_level: "WITHIN_MONTH",
                case_type: "LEGAL",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-003",
                assigned_to: {
                    id: "user-003",
                    first_name: "Lisa",
                    last_name: "Martinez",
                    email: "lisa.martinez@org.com"
                },
                due_date: "2024-03-20",
                estimated_duration: "3_MONTHS",
                budget_allocated: "$800",
                tags: ["legal", "immigration", "asylum", "translation", "documentation"],
                notes_count: 15,
                documents_count: 12,
                last_activity: "2024-01-11T14:15:00Z",
                created_at: "2024-01-02T10:00:00Z",
                updated_at: "2024-01-11T14:15:00Z"
            },
            {
                id: "case-004",
                case_number: "CASE-2024-004",
                title: "English Language Learning Support",
                description: "Enrollment in ESL classes and educational support to improve English proficiency for better employment opportunities.",
                status: "OPEN",
                priority: "MEDIUM",
                urgency_level: "FLEXIBLE",
                case_type: "EDUCATION",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-004",
                assigned_to: {
                    id: "user-004",
                    first_name: "Jennifer",
                    last_name: "Wilson",
                    email: "jennifer.wilson@org.com"
                },
                due_date: "2024-04-15",
                estimated_duration: "6_MONTHS",
                budget_allocated: "$400",
                tags: ["education", "esl", "language", "employment", "skills"],
                notes_count: 6,
                documents_count: 4,
                last_activity: "2024-01-09T13:30:00Z",
                created_at: "2024-01-07T11:45:00Z",
                updated_at: "2024-01-09T13:30:00Z"
            }
        ],
        "ben-003": [
            {
                id: "case-005",
                case_number: "CASE-2024-005",
                title: "Job Training and Placement",
                description: "Vocational training program enrollment and job placement assistance. Focus on healthcare support roles with certification preparation.",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                urgency_level: "WITHIN_MONTH",
                case_type: "EMPLOYMENT",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-005",
                assigned_to: {
                    id: "user-005",
                    first_name: "Robert",
                    last_name: "Thompson",
                    email: "robert.thompson@org.com"
                },
                due_date: "2024-05-01",
                estimated_duration: "3_MONTHS",
                budget_allocated: "$1,500",
                tags: ["employment", "training", "healthcare", "certification", "placement"],
                notes_count: 9,
                documents_count: 7,
                last_activity: "2024-01-12T10:00:00Z",
                created_at: "2024-01-03T09:15:00Z",
                updated_at: "2024-01-12T10:00:00Z"
            },
            {
                id: "case-006",
                case_number: "CASE-2024-006",
                title: "Childcare Support Services",
                description: "Assistance with finding affordable childcare options to enable participation in job training program. Includes subsidy application support.",
                status: "PENDING",
                priority: "HIGH",
                urgency_level: "WITHIN_WEEK",
                case_type: "SUPPORT",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-006",
                assigned_to: {
                    id: "user-006",
                    first_name: "Amanda",
                    last_name: "Davis",
                    email: "amanda.davis@org.com"
                },
                due_date: "2024-02-20",
                estimated_duration: "1_MONTH",
                budget_allocated: "$600",
                tags: ["childcare", "support", "subsidy", "training", "family"],
                notes_count: 7,
                documents_count: 5,
                last_activity: "2024-01-11T15:45:00Z",
                created_at: "2024-01-06T12:00:00Z",
                updated_at: "2024-01-11T15:45:00Z"
            }
        ],
        "ben-004": [
            {
                id: "case-007",
                case_number: "CASE-2024-007",
                title: "Mental Health Counseling Support",
                description: "Connection to mental health services and trauma counseling. Includes insurance coordination and transportation assistance for appointments.",
                status: "IN_PROGRESS",
                priority: "HIGH",
                urgency_level: "WITHIN_WEEK",
                case_type: "MENTAL_HEALTH",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-007",
                assigned_to: {
                    id: "user-007",
                    first_name: "Dr. Patricia",
                    last_name: "Lee",
                    email: "patricia.lee@org.com"
                },
                due_date: "2024-02-25",
                estimated_duration: "ONGOING",
                budget_allocated: "$900",
                tags: ["mental-health", "counseling", "trauma", "insurance", "transportation"],
                notes_count: 11,
                documents_count: 6,
                last_activity: "2024-01-12T14:20:00Z",
                created_at: "2024-01-04T08:30:00Z",
                updated_at: "2024-01-12T14:20:00Z"
            }
        ],
        "ben-005": [
            {
                id: "case-008",
                case_number: "CASE-2024-008",
                title: "Family Reunification Support",
                description: "Assistance with family reunification process including documentation, legal support, and coordination with international agencies.",
                status: "IN_PROGRESS",
                priority: "URGENT",
                urgency_level: "IMMEDIATE",
                case_type: "FAMILY_REUNIFICATION",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-008",
                assigned_to: {
                    id: "user-008",
                    first_name: "James",
                    last_name: "Rodriguez",
                    email: "james.rodriguez@org.com"
                },
                due_date: "2024-03-10",
                estimated_duration: "6_MONTHS",
                budget_allocated: "$2,000",
                tags: ["family", "reunification", "legal", "international", "documentation"],
                notes_count: 18,
                documents_count: 15,
                last_activity: "2024-01-12T17:30:00Z",
                created_at: "2024-01-01T10:00:00Z",
                updated_at: "2024-01-12T17:30:00Z"
            },
            {
                id: "case-009",
                case_number: "CASE-2024-009",
                title: "Financial Literacy and Banking",
                description: "Financial education program and assistance with opening bank account, understanding credit, and budgeting for family expenses.",
                status: "OPEN",
                priority: "LOW",
                urgency_level: "FLEXIBLE",
                case_type: "FINANCIAL",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-009",
                assigned_to: {
                    id: "user-009",
                    first_name: "Karen",
                    last_name: "Brown",
                    email: "karen.brown@org.com"
                },
                due_date: "2024-04-30",
                estimated_duration: "2_MONTHS",
                budget_allocated: "$250",
                tags: ["financial", "education", "banking", "credit", "budgeting"],
                notes_count: 3,
                documents_count: 2,
                last_activity: "2024-01-08T09:45:00Z",
                created_at: "2024-01-08T09:00:00Z",
                updated_at: "2024-01-08T09:45:00Z"
            },
            {
                id: "case-010",
                case_number: "CASE-2024-010",
                title: "Cultural Integration Program",
                description: "Community integration support including cultural orientation, local resource navigation, and social connection facilitation.",
                status: "CLOSED",
                priority: "MEDIUM",
                urgency_level: "FLEXIBLE",
                case_type: "OTHER",
                beneficiary_id: beneficiaryId,
                beneficiary,
                assigned_to_id: "user-010",
                assigned_to: {
                    id: "user-010",
                    first_name: "Maria",
                    last_name: "Garcia",
                    email: "maria.garcia@org.com"
                },
                due_date: "2024-01-15",
                estimated_duration: "1_MONTH",
                budget_allocated: "$300",
                tags: ["cultural", "integration", "community", "orientation", "social"],
                notes_count: 8,
                documents_count: 4,
                last_activity: "2024-01-15T16:00:00Z",
                created_at: "2023-12-15T10:00:00Z",
                updated_at: "2024-01-15T16:00:00Z"
            }
        ]
    };

    return casesData[beneficiaryId] || [];
    */
};

const BeneficiaryCasesPage = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const [cases, setCases] = useState<CaseSchema[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const beneficiaryId = pathname.split("/")[5];
    const organizationId = pathname.split("/")[3];
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    useEffect(() => {
        const fetchCases = async () => {
            try {
                if (beneficiaryId && organizationId) {
                    const data = await getBeneficiaryCases(beneficiaryId, organizationId);
                    setCases(data);
                }
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCases();
    }, [beneficiaryId]);

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

    if (isLoading) {
        return (
            <div className="text-relif-orange-400 font-medium text-sm">
                Loading cases...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 font-medium text-sm">
                Error loading cases
            </div>
        );
    }

    return (
        <div className="w-full h-max flex flex-col gap-4">
            {/* Header */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <FaFileAlt className="text-relif-orange-200" />
                        Beneficiary Cases ({cases.length})
                    </h3>
                    <Link href={`/${locale}/app/${organizationId}/cases/create`}>
                        <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                            <FaPlus className="w-4 h-4 mr-2" />
                            Create New Case
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Cases List */}
            {cases.length === 0 ? (
                <div className="w-full border-[1px] border-slate-200 rounded-lg p-4">
                    <div className="text-center py-8 text-slate-500">
                        <FaFileAlt className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p>No cases found for this beneficiary.</p>
                        <p className="text-sm text-slate-400 mt-1">Create a new case to get started.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {cases.map((caseItem) => {
                        const isOverdue = caseItem.due_date && new Date(caseItem.due_date) < new Date();
                        
                        return (
                            <div key={caseItem.id} className="w-full border-[1px] border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-base text-slate-900">
                                                {convertToTitleCase(caseItem.title)}
                                            </h4>
                                            <span className="text-sm text-slate-500">
                                                {caseItem.case_number}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {caseItem.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <Badge className={STATUS_COLORS[caseItem.status as keyof typeof STATUS_COLORS]}>
                                                {caseItem.status.replace("_", " ")}
                                            </Badge>
                                            <Badge className={PRIORITY_COLORS[caseItem.priority as keyof typeof PRIORITY_COLORS]}>
                                                {caseItem.priority}
                                            </Badge>
                                            {caseItem.urgency_level && (
                                                <Badge className={URGENCY_COLORS[caseItem.urgency_level as keyof typeof URGENCY_COLORS]}>
                                                    {caseItem.urgency_level.replace("_", " ")}
                                                </Badge>
                                            )}
                                            {isOverdue && (
                                                <Badge className="bg-red-200 text-red-900 hover:bg-red-300">
                                                    OVERDUE
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <FaClock className="w-3 h-3" />
                                                Due: {caseItem.due_date ? formatDate(caseItem.due_date, locale) : "No due date"}
                                            </span>
                                            {caseItem.budget_allocated && (
                                                <span className="flex items-center gap-1">
                                                    <FaDollarSign className="w-3 h-3" />
                                                    {caseItem.budget_allocated}
                                                </span>
                                            )}
                                            <span>Assigned to: {caseItem.assigned_to.first_name} {caseItem.assigned_to.last_name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link href={`/${locale}/app/${organizationId}/cases/${caseItem.id}`}>
                                            <Button size="sm" className="bg-relif-orange-200 hover:bg-relif-orange-300 text-white">
                                                <FaEye className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                
                                {caseItem.tags && caseItem.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-100">
                                        {caseItem.tags.slice(0, 3).map((tag, index) => (
                                            <Badge key={index} className="bg-relif-orange-500 text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                        {caseItem.tags.length > 3 && (
                                            <Badge className="bg-slate-100 text-slate-600 text-xs">
                                                +{caseItem.tags.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BeneficiaryCasesPage; 