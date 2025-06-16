"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdSearch, MdFilterList, MdClear } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { CaseSchema, CaseStatsSchema } from "@/types/case.types";
import { getCasesByOrganizationID, getCaseStats } from "@/repository/organization.repository";
import { usePathname } from "next/navigation";
import {
    FaFileAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";

import { Card as CaseCard } from "./card.layout";
import { CaseToolbar as Toolbar } from "./toolbar.layout";

// Filter types
interface CaseFilters {
    status: string[];
    priority: string[];
    case_type: string[];
    assigned_to: string[];
    urgency_level: string[];
    date_from: Date | null;
    date_to: Date | null;
}

const initialFilters: CaseFilters = {
    status: [],
    priority: [],
    case_type: [],
    assigned_to: [],
    urgency_level: [],
    date_from: null,
    date_to: null,
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
    const [cases, setCases] = useState<{
        count: number;
        data: CaseSchema[];
    } | null>(null);
    const [stats, setStats] = useState<CaseStatsSchema | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
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
            const allCases = response.data.data || [];
            const filteredCases = applyFilters(allCases);

            // Apply pagination to filtered results
            const startIndex = offset;
            const endIndex = offset + LIMIT;
            const paginatedCases = filteredCases.slice(startIndex, endIndex);

            // Update cases with paginated filtered results
            setCases({
                count: filteredCases.length,
                data: paginatedCases,
            });
        } catch (err) {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, [pathname, offset, searchTerm, filters]);

    const getCasesStats = useCallback(async () => {
        try {
            setIsLoadingStats(true);

            const pathParts = pathname.split("/");
            const organizationId = pathParts[3];
            if (!organizationId) {
                throw new Error("Organization ID not found");
            }

            const response = await getCaseStats(organizationId);
            setStats(response.data);
        } catch (err) {
            console.error("Error fetching case stats:", err);
            // Set default stats on error
            setStats({
                total_cases: 0,
                open_cases: 0,
                in_progress_cases: 0,
                overdue_cases: 0,
                closed_this_month: 0,
                avg_resolution_days: 0,
            });
        } finally {
            setIsLoadingStats(false);
        }
    }, [pathname]);

    useEffect(() => {
        getCasesList();
        getCasesStats();
    }, [getCasesList, getCasesStats]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setOffset(0); // Reset to first page when searching
    };

    const handleFilterChange = (filterType: keyof CaseFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value,
        }));
        setOffset(0); // Reset to first page when filtering
    };

    const addFilterValue = (filterType: keyof CaseFilters, value: string) => {
        if (filterType === "date_from" || filterType === "date_to") return;

        const currentValues = filters[filterType] as string[];
        if (!currentValues.includes(value)) {
            handleFilterChange(filterType, [...currentValues, value]);
        }
    };

    const removeFilterValue = (filterType: keyof CaseFilters, value: string) => {
        if (filterType === "date_from" || filterType === "date_to") {
            handleFilterChange(filterType, null);
            return;
        }

        const currentValues = filters[filterType] as string[];
        handleFilterChange(
            filterType,
            currentValues.filter(v => v !== value)
        );
    };

    const clearAllFilters = () => {
        setFilters(initialFilters);
        setOffset(0);
    };

    const getActiveFiltersCount = () => {
        const counts = [
            filters.status.length,
            filters.priority.length,
            filters.case_type.length,
            filters.assigned_to.length,
            filters.urgency_level.length,
            filters.date_from ? 1 : 0,
            filters.date_to ? 1 : 0,
        ];
        return counts.reduce((sum, count) => sum + count, 0);
    };

    const currentPage = Math.floor(offset / LIMIT) + 1;
    const totalPages = cases ? Math.ceil(cases.count / LIMIT) : 1;

    const handlePageChange = (page: number) => {
        const newOffset = (page - 1) * LIMIT;
        setOffset(newOffset);
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <>
            {/* Stats Cards - Horizontal Layout like Home Page */}
            <div className="w-full grid grid-cols-4 gap-4 lg:flex lg:flex-wrap mb-4">
                <div className="w-full h-max rounded-lg bg-blue-500 overflow-hidden flex flex-col">
                    <div className="w-full py-1 px-5 bg-blue-600 lg:p-3">
                        <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                            <FaFileAlt />
                            Total Cases
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-white font-bold lg:text-2xl">
                            {isLoadingStats ? "..." : stats?.total_cases || 0}
                        </span>
                    </div>
                </div>
                <div className="w-full h-max rounded-lg bg-orange-500 overflow-hidden flex flex-col">
                    <div className="w-full py-1 px-5 bg-orange-600 lg:p-3">
                        <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                            <FaClock />
                            Open Cases
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-white font-bold lg:text-2xl">
                            {isLoadingStats ? "..." : stats?.open_cases || 0}
                        </span>
                    </div>
                </div>
                <div className="w-full h-max rounded-lg bg-red-500 overflow-hidden flex flex-col">
                    <div className="w-full py-1 px-5 bg-red-600 lg:p-3">
                        <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                            <FaExclamationTriangle />
                            Overdue
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-white font-bold lg:text-2xl">
                            {isLoadingStats ? "..." : stats?.overdue_cases || 0}
                        </span>
                    </div>
                </div>
                <div className="w-full h-max rounded-lg bg-green-500 overflow-hidden flex flex-col">
                    <div className="w-full py-1 px-5 bg-green-600 lg:p-3">
                        <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                            <FaCheckCircle />
                            Closed This Month
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-white font-bold lg:text-2xl">
                            {isLoadingStats ? "..." : stats?.closed_this_month || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Toolbar - Following Beneficiary Pattern */}
            <div className="flex items-end gap-4 justify-between lg:flex-row-reverse">
                <div className="relative lg:grow">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                    <Input
                        type="text"
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-[300px] lg:w-full pl-10"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {/* Compact Filter Dropdown */}
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-sm border-slate-200"
                            >
                                <MdFilterList />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-relif-orange-400 text-white hover:bg-relif-orange-500 flex items-center justify-center rounded-full">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
                            <div className="flex flex-col max-h-[50vh]">
                                <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                                    <h4 className="font-medium text-sm">Filter Cases</h4>
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAllFilters}
                                            className="text-xs hover:text-red-600 h-6 px-2"
                                        >
                                            <MdClear className="mr-1 h-3 w-3" />
                                            Clear all
                                        </Button>
                                    )}
                                </div>

                                <div className="p-4 space-y-4 overflow-y-auto min-h-0">
                                    {/* Status Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Status
                                        </label>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Note: All cases except "Closed" and "Cancelled" are
                                            considered active/open
                                        </p>
                                        <Select
                                            onValueChange={value => addFilterValue("status", value)}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select status..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.status.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-xs"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Priority Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Priority
                                        </label>
                                        <Select
                                            onValueChange={value =>
                                                addFilterValue("priority", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select priority..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.priority.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-xs"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Case Type Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Case Type
                                        </label>
                                        <Select
                                            onValueChange={value =>
                                                addFilterValue("case_type", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select type..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.case_type.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-xs"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Urgency Level Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Urgency
                                        </label>
                                        <Select
                                            onValueChange={value =>
                                                addFilterValue("urgency_level", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select urgency..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.urgency_level.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-xs"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Assigned To Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Assigned To
                                        </label>
                                        <Select
                                            onValueChange={value =>
                                                addFilterValue("assigned_to", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select user..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getUniqueUsers(cases?.data || null).map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-xs"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    {/* Date Filters */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-slate-700">
                                            Date Range
                                        </label>

                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Date From */}
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-600">
                                                    From
                                                </label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-8 justify-start text-left font-normal text-xs"
                                                        >
                                                            <FaCalendarAlt className="mr-1 h-3 w-3" />
                                                            {filters.date_from
                                                                ? format(
                                                                      filters.date_from,
                                                                      "MMM dd"
                                                                  )
                                                                : "Pick..."}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                filters.date_from || undefined
                                                            }
                                                            onSelect={date =>
                                                                handleFilterChange(
                                                                    "date_from",
                                                                    date || null
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            {/* Date To */}
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-600">To</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-8 justify-start text-left font-normal text-xs"
                                                        >
                                                            <FaCalendarAlt className="mr-1 h-3 w-3" />
                                                            {filters.date_to
                                                                ? format(filters.date_to, "MMM dd")
                                                                : "Pick..."}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={filters.date_to || undefined}
                                                            onSelect={date =>
                                                                handleFilterChange(
                                                                    "date_to",
                                                                    date || null
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Toolbar />
                </div>
            </div>

            {/* Active Filters Display - Compact Row */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center py-2">
                    <span className="text-xs font-medium text-slate-600">Active filters:</span>

                    {/* Status badges */}
                    {filters.status.map(status => (
                        <Badge key={`status-${status}`} variant="secondary" className="text-xs h-6">
                            Status: {filterOptions.status.find(o => o.value === status)?.label}
                            <button
                                onClick={() => removeFilterValue("status", status)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Priority badges */}
                    {filters.priority.map(priority => (
                        <Badge
                            key={`priority-${priority}`}
                            variant="secondary"
                            className="text-xs h-6"
                        >
                            Priority:{" "}
                            {filterOptions.priority.find(o => o.value === priority)?.label}
                            <button
                                onClick={() => removeFilterValue("priority", priority)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Case type badges */}
                    {filters.case_type.map(type => (
                        <Badge key={`type-${type}`} variant="secondary" className="text-xs h-6">
                            Type: {filterOptions.case_type.find(o => o.value === type)?.label}
                            <button
                                onClick={() => removeFilterValue("case_type", type)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Urgency badges */}
                    {filters.urgency_level.map(urgency => (
                        <Badge
                            key={`urgency-${urgency}`}
                            variant="secondary"
                            className="text-xs h-6"
                        >
                            Urgency:{" "}
                            {filterOptions.urgency_level.find(o => o.value === urgency)?.label}
                            <button
                                onClick={() => removeFilterValue("urgency_level", urgency)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Assigned to badges */}
                    {filters.assigned_to.map(userId => (
                        <Badge
                            key={`assigned-${userId}`}
                            variant="secondary"
                            className="text-xs h-6"
                        >
                            Assigned:{" "}
                            {
                                getUniqueUsers(cases?.data || null).find(u => u.value === userId)
                                    ?.label
                            }
                            <button
                                onClick={() => removeFilterValue("assigned_to", userId)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Date badges */}
                    {filters.date_from && (
                        <Badge variant="secondary" className="text-xs h-6">
                            From: {format(filters.date_from, "MMM dd, yyyy")}
                            <button
                                onClick={() => removeFilterValue("date_from", "")}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}

                    {filters.date_to && (
                        <Badge variant="secondary" className="text-xs h-6">
                            To: {format(filters.date_to, "MMM dd, yyyy")}
                            <button
                                onClick={() => removeFilterValue("date_to", "")}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Cases List Container - Following Beneficiary Pattern */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-230px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        Loading cases...
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        Something went wrong. Please try again later.
                    </span>
                )}

                {!isLoading && !error && cases && cases.count <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        No cases found...
                    </span>
                )}

                {!isLoading && !error && cases && cases.count > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {cases?.data.map(case_ => (
                                <CaseCard key={case_.id} data={case_} refreshList={getCasesList} />
                            ))}
                        </ul>
                        <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage === 1 ? 1 : currentPage - 1
                                                )
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
                                                    currentPage === totalPages
                                                        ? totalPages
                                                        : currentPage + 1
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
