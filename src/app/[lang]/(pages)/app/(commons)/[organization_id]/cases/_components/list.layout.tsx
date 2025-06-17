"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdAdd } from "react-icons/md";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { CaseSchema, CaseStatsSchema } from "@/types/case.types";
import { getCasesByOrganizationID } from "@/repository/organization.repository";
import { usePathname, useRouter } from "next/navigation";
import {
    FaFileAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { StatisticsCards } from "@/components/ui/statistics-cards";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";

import { Card as CaseCard } from "./card.layout";
import { CaseToolbar as Toolbar } from "./toolbar.layout";
import { DebugInfo } from "@/components/debug-info";

// Filter types
interface CaseFilters {
    status: string[];
    priority: string[];
    case_type: string[];
    assigned_to: string[];
    urgency_level: string[];
    date_from: Date | null;
    date_to: Date | null;
    due_date_from: Date | null;
    due_date_to: Date | null;
}

const initialFilters: CaseFilters = {
    status: [],
    priority: [],
    case_type: [],
    assigned_to: [],
    urgency_level: [],
    date_from: null,
    date_to: null,
    due_date_from: null,
    due_date_to: null,
};

// Available filter options
const filterOptions = {
    status: [
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "PENDING", label: "Pending" },
        { value: "ON_HOLD", label: "On Hold" },
        { value: "CLOSED", label: "Closed" },
        { value: "CANCELLED", label: "Cancelled" },
    ],
    priority: [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
        { value: "URGENT", label: "Urgent" },
    ],
    case_type: [
        { value: "HOUSING", label: "Housing" },
        { value: "LEGAL", label: "Legal" },
        { value: "MEDICAL", label: "Medical" },
        { value: "SUPPORT", label: "Support" },
        { value: "OTHER", label: "Other" },
    ],
    urgency_level: [
        { value: "IMMEDIATE", label: "Immediate" },
        { value: "WITHIN_WEEK", label: "Within Week" },
        { value: "WITHIN_MONTH", label: "Within Month" },
        { value: "FLEXIBLE", label: "Flexible" },
    ],
};

// Get unique assigned users from cases data
const getUniqueUsers = (casesData: CaseSchema[] | null) => {
    if (!casesData) return [];

    const users = casesData.map(case_ => case_.assigned_to).filter(Boolean);
    const uniqueUsers = users.filter(
        (user, index, self) => user && index === self.findIndex(u => u && u.id === user.id)
    );
    return uniqueUsers.map(user => ({
        value: user!.id,
        label: `${user!.first_name} ${user!.last_name}`,
    }));
};

const CaseList = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const [cases, setCases] = useState<{
        count: number;
        data: CaseSchema[];
    } | null>(null);
    const [allFilteredCases, setAllFilteredCases] = useState<CaseSchema[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState<CaseFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const LIMIT = 20;

    // Helper function to apply client-side filtering
    const applyFilters = (casesData: CaseSchema[]): CaseSchema[] => {
        return casesData.filter(caseItem => {
            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(caseItem.status)) {
                return false;
            }

            // Priority filter
            if (filters.priority.length > 0 && !filters.priority.includes(caseItem.priority)) {
                return false;
            }

            // Case type filter
            if (filters.case_type.length > 0 && !filters.case_type.includes(caseItem.case_type)) {
                return false;
            }

            // Urgency level filter
            if (
                filters.urgency_level.length > 0 &&
                caseItem.urgency_level &&
                !filters.urgency_level.includes(caseItem.urgency_level)
            ) {
                return false;
            }

            // Assigned to filter
            if (
                filters.assigned_to.length > 0 &&
                !filters.assigned_to.includes(caseItem.assigned_to_id)
            ) {
                return false;
            }

            // Date from filter
            if (filters.date_from && caseItem.created_at) {
                const caseDate = new Date(caseItem.created_at);
                if (caseDate < filters.date_from) {
                    return false;
                }
            }

            // Date to filter
            if (filters.date_to && caseItem.created_at) {
                const caseDate = new Date(caseItem.created_at);
                // Set time to end of day for date_to comparison
                const endOfDay = new Date(filters.date_to);
                endOfDay.setHours(23, 59, 59, 999);
                if (caseDate > endOfDay) {
                    return false;
                }
            }

            // Due date from filter
            if (filters.due_date_from && caseItem.due_date) {
                const dueDateCase = new Date(caseItem.due_date);
                if (dueDateCase < filters.due_date_from) {
                    return false;
                }
            }

            // Due date to filter
            if (filters.due_date_to && caseItem.due_date) {
                const dueDateCase = new Date(caseItem.due_date);
                // Set time to end of day for due_date_to comparison
                const endOfDay = new Date(filters.due_date_to);
                endOfDay.setHours(23, 59, 59, 999);
                if (dueDateCase > endOfDay) {
                    return false;
                }
            }

            return true;
        });
    };

    const getCasesList = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(false);

            const pathParts = pathname.split("/");
            const organizationId = pathParts[3];
            if (!organizationId) {
                throw new Error("Organization ID not found");
            }

            // Get all cases first (with a higher limit to ensure we get all cases for filtering)
            const response = await getCasesByOrganizationID(
                organizationId,
                0, // Always start from 0 to get all cases for filtering
                1000, // Get more cases to apply filters client-side
                searchTerm
            );

            // Apply client-side filtering
            let allCases = response.data.data || [];
            const filteredCases = applyFilters(allCases);

            // Store all filtered cases for export
            setAllFilteredCases(filteredCases);

            // Apply pagination to filtered results
            const paginatedCases = filteredCases.slice(offset, offset + LIMIT);

            setCases({
                count: filteredCases.length,
                data: paginatedCases,
            });
        } catch (error: any) {
            console.error("❌ Error fetching cases:", {
                error,
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                organizationId: pathname.split("/")[3],
                searchTerm,
                filters
            });
            setError(true);
            setCases({ count: 0, data: [] }); // Ensure cases is set to empty state
            setAllFilteredCases([]); // Reset filtered cases on error
        } finally {
            setIsLoading(false);
        }
    }, [pathname, searchTerm, filters, offset]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getCasesList();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters, offset]);

    const addFilterValue = (filterType: string, value: string) => {
        const typedFilterType = filterType as keyof CaseFilters;
        
        // Handle date filters
        if (filterType === "date_from" || filterType === "date_to" || filterType === "due_date_from" || filterType === "due_date_to") {
            setFilters(prev => ({
                ...prev,
                [typedFilterType]: new Date(value),
            }));
        } else {
            // Handle array filters
            setFilters(prev => ({
                ...prev,
                [typedFilterType]: [...(prev[typedFilterType] as string[]), value],
            }));
        }
        setOffset(0); // Reset to first page when filtering
    };

    const removeFilterValue = (filterType: string, value: string) => {
        const typedFilterType = filterType as keyof CaseFilters;
        
        if (filterType === "date_from" || filterType === "date_to" || filterType === "due_date_from" || filterType === "due_date_to") {
            setFilters(prev => ({
                ...prev,
                [typedFilterType]: null,
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [typedFilterType]: (prev[typedFilterType] as string[]).filter(item => item !== value),
            }));
        }
        setOffset(0); // Reset to first page when filtering
    };

    const clearAllFilters = () => {
        setFilters(initialFilters);
        setOffset(0);
    };

    const getActiveFiltersCount = () => {
        return (
            filters.status.length +
            filters.priority.length +
            filters.case_type.length +
            filters.assigned_to.length +
            filters.urgency_level.length +
            (filters.date_from ? 1 : 0) +
            (filters.date_to ? 1 : 0) +
            (filters.due_date_from ? 1 : 0) +
            (filters.due_date_to ? 1 : 0)
        );
    };

    const getActiveFilters = () => {
        const activeFilters: Array<{
            type: string;
            value: string;
            label: string;
            displayLabel: string;
        }> = [];

        // Status filters
        filters.status.forEach(status => {
            const option = filterOptions.status.find(opt => opt.value === status);
            if (option) {
                activeFilters.push({
                    type: 'status',
                    value: status,
                    label: option.label,
                    displayLabel: `Status: ${option.label}`
                });
            }
        });

        // Priority filters
        filters.priority.forEach(priority => {
            const option = filterOptions.priority.find(opt => opt.value === priority);
            if (option) {
                activeFilters.push({
                    type: 'priority',
                    value: priority,
                    label: option.label,
                    displayLabel: `Priority: ${option.label}`
                });
            }
        });

        // Case type filters
        filters.case_type.forEach(caseType => {
            const option = filterOptions.case_type.find(opt => opt.value === caseType);
            if (option) {
                activeFilters.push({
                    type: 'case_type',
                    value: caseType,
                    label: option.label,
                    displayLabel: `Type: ${option.label}`
                });
            }
        });

        // Urgency level filters
        filters.urgency_level.forEach(urgency => {
            const option = filterOptions.urgency_level.find(opt => opt.value === urgency);
            if (option) {
                activeFilters.push({
                    type: 'urgency_level',
                    value: urgency,
                    label: option.label,
                    displayLabel: `Urgency: ${option.label}`
                });
            }
        });

        // Assigned to filters
        const userOptions = getUniqueUsers(cases?.data || null);
        filters.assigned_to.forEach(userId => {
            const option = userOptions.find(opt => opt.value === userId);
            if (option) {
                activeFilters.push({
                    type: 'assigned_to',
                    value: userId,
                    label: option.label,
                    displayLabel: `Assigned: ${option.label}`
                });
            }
        });

        // Date filters
        if (filters.date_from) {
            activeFilters.push({
                type: 'date_from',
                value: filters.date_from.toISOString(),
                label: filters.date_from.toLocaleDateString(),
                displayLabel: `Created From: ${filters.date_from.toLocaleDateString()}`
            });
        }

        if (filters.date_to) {
            activeFilters.push({
                type: 'date_to',
                value: filters.date_to.toISOString(),
                label: filters.date_to.toLocaleDateString(),
                displayLabel: `Created To: ${filters.date_to.toLocaleDateString()}`
            });
        }

        if (filters.due_date_from) {
            activeFilters.push({
                type: 'due_date_from',
                value: filters.due_date_from.toISOString(),
                label: filters.due_date_from.toLocaleDateString(),
                displayLabel: `Due From: ${filters.due_date_from.toLocaleDateString()}`
            });
        }

        if (filters.due_date_to) {
            activeFilters.push({
                type: 'due_date_to',
                value: filters.due_date_to.toISOString(),
                label: filters.due_date_to.toLocaleDateString(),
                displayLabel: `Due To: ${filters.due_date_to.toLocaleDateString()}`
            });
        }

        return activeFilters;
    };

    const handlePageChange = (page: number) => {
        setOffset((page - 1) * LIMIT);
    };

    const totalPages = cases ? Math.ceil(cases.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;
    const activeFiltersCount = getActiveFiltersCount();

    let casesData = cases?.data || [];
    // DEV MOCK: Always inject mock cases in development mode if error or no data
    if (process.env.NODE_ENV === 'development' && (error || casesData.length === 0)) {
        casesData = [
            {
                id: 'mock-1',
                case_number: 'CASE-2025-0001',
                title: 'Mock Case 1',
                description: 'This is a mock case for testing.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                urgency_level: 'IMMEDIATE',
                case_type: 'LEGAL',
                beneficiary_id: 'mock-beneficiary-1',
                beneficiary: {
                    id: 'mock-beneficiary-1',
                    first_name: 'John',
                    last_name: 'Doe',
                    full_name: 'John Doe',
                },
                assigned_to_id: 'mock-user-1',
                assigned_to: {
                    id: 'mock-user-1',
                    first_name: 'Jane',
                    last_name: 'Smith',
                    email: 'jane@example.com',
                },
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                estimated_duration: '1 Month',
                budget_allocated: '1000',
                tags: ['mock', 'test'],
                notes_count: 2,
                documents_count: 1,
                last_activity: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'mock-2',
                case_number: 'CASE-2025-0002',
                title: 'Mock Case 2',
                description: 'Another mock case for testing.',
                status: 'CLOSED',
                priority: 'LOW',
                urgency_level: 'FLEXIBLE',
                case_type: 'HOUSING',
                beneficiary_id: 'mock-beneficiary-2',
                beneficiary: {
                    id: 'mock-beneficiary-2',
                    first_name: 'Alice',
                    last_name: 'Brown',
                    full_name: 'Alice Brown',
                },
                assigned_to_id: 'mock-user-2',
                assigned_to: {
                    id: 'mock-user-2',
                    first_name: 'Bob',
                    last_name: 'Jones',
                    email: 'bob@example.com',
                },
                due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                estimated_duration: '2 Weeks',
                budget_allocated: '500',
                tags: ['mock', 'closed'],
                notes_count: 1,
                documents_count: 0,
                last_activity: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    }

    // Calculate stats from the final casesData
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalCases = casesData.length;
    const openCases = casesData.filter(c => c.status !== 'CLOSED' && c.status !== 'CANCELLED').length;
    const overdueCases = casesData.filter(c => {
        if (!c.due_date) return false;
        const dueDate = new Date(c.due_date);
        return dueDate < now && c.status !== 'CLOSED' && c.status !== 'CANCELLED';
    }).length;
    const closedThisMonth = casesData.filter(c => {
        if (c.status !== 'CLOSED') return false;
        const updatedDate = new Date(c.updated_at);
        return updatedDate >= startOfMonth;
    }).length;

    // Statistics cards data
    const statisticsCards = [
        {
            title: "Total Cases",
            value: isLoading ? "..." : totalCases,
            icon: <FaFileAlt />,
            color: "blue" as const,
            isLoading,
        },
        {
            title: "Open Cases",
            value: isLoading ? "..." : openCases,
            icon: <FaClock />,
            color: "orange" as const,
            isLoading,
        },
        {
            title: "Overdue",
            value: isLoading ? "..." : overdueCases,
            icon: <FaExclamationTriangle />,
            color: "red" as const,
            isLoading,
        },
        {
            title: "Closed This Month",
            value: isLoading ? "..." : closedThisMonth,
            icon: <FaCheckCircle />,
            color: "green" as const,
            isLoading,
        },
    ];

    // Filter sections for the search bar
    const filterSections = [
        {
            key: "status",
            label: "Status",
            options: filterOptions.status,
            placeholder: "Select status...",
            note: 'Note: All cases except "Closed" and "Cancelled" are considered active/open',
        },
        {
            key: "priority",
            label: "Priority",
            options: filterOptions.priority,
            placeholder: "Select priority...",
        },
        {
            key: "case_type",
            label: "Case Type",
            options: filterOptions.case_type,
            placeholder: "Select type...",
        },
        {
            key: "urgency_level",
            label: "Urgency",
            options: filterOptions.urgency_level,
            placeholder: "Select urgency...",
        },
        {
            key: "assigned_to",
            label: "Assigned To",
            options: getUniqueUsers(cases?.data || null),
            placeholder: "Select user...",
        },
        {
            key: "date_from",
            label: "Created From",
            type: "date" as const,
            placeholder: "Select start date...",
        },
        {
            key: "date_to",
            label: "Created To",
            type: "date" as const,
            placeholder: "Select end date...",
        },
        {
            key: "due_date_from",
            label: "Due Date From",
            type: "date" as const,
            placeholder: "Select due date start...",
        },
        {
            key: "due_date_to",
            label: "Due Date To",
            type: "date" as const,
            placeholder: "Select due date end...",
        },
    ];

    const handleCreateCase = () => {
        const organizationId = pathname.split("/")[3];
        router.push(`/${pathname.split("/")[1]}/app/${organizationId}/cases/create`);
    };

    // If error and in development, skip error return to show mock data
    if (error && process.env.NODE_ENV !== 'development') {
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                Error loading cases. Please try again.
            </span>
        );
    }

    return (
        <>
            {/* Debug Info - Only shows in development */}
            <DebugInfo 
                title="Cases List"
                data={{ cases, searchTerm, filters, offset, currentPage, totalPages }}
                error={error}
                isLoading={isLoading}
            />
            
            {/* Statistics Cards */}
            <StatisticsCards cards={statisticsCards} />

            {/* Search and Filter Bar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search cases..."
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                filterSections={filterSections}
                filterTitle="Filter Cases"
                onFilterAdd={addFilterValue}
                onFilterRemove={removeFilterValue}
                onFilterClear={clearAllFilters}
                activeFiltersCount={activeFiltersCount}
                activeFilters={getActiveFilters()}
                additionalActions={<Toolbar filteredCases={allFilteredCases} searchTerm={searchTerm} />}
            />

            {/* Cases List */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-300px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading cases...</h2>
                )}

                {!isLoading && casesData.length <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        No cases found matching your criteria.
                    </span>
                )}

                {!isLoading && casesData.length > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {casesData.map(caseItem => (
                                <CaseCard key={caseItem.id} data={caseItem} refreshList={getCasesList} />
                            ))}
                        </ul>
                        <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(currentPage === 1 ? 1 : currentPage - 1)
                                            }
                                        />
                                    </PaginationItem>
                                    <PaginationItem className="rounded-md border border-relif-orange-200 px-2 py-1 text-sm text-relif-orange-200">
                                        {currentPage} / {totalPages}
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage === totalPages ? totalPages : currentPage + 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export { CaseList }; 