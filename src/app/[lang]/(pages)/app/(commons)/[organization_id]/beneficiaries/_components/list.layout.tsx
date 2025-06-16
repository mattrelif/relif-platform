"use client";

import { Toolbar } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/_components/toolbar.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdSearch } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MdFilterList, MdClear } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";

import { Card } from "./card.layout";

// Filter types
interface BeneficiaryFilters {
    status: string[];
    civil_status: string[];
    age_range: string[];
    date_from: Date | null;
    date_to: Date | null;
}

const initialFilters: BeneficiaryFilters = {
    status: [],
    civil_status: [],
    age_range: [],
    date_from: null,
    date_to: null
};

// Available filter options
const filterOptions = {
    status: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
        { value: "PENDING", label: "Pending" },
        { value: "ARCHIVED", label: "Archived" }
    ],
    civil_status: [
        { value: "SINGLE", label: "Single" },
        { value: "MARRIED", label: "Married" },
        { value: "DIVORCED", label: "Divorced" },
        { value: "WIDOWED", label: "Widowed" },
        { value: "SEPARATED", label: "Separated" }
    ],
    age_range: [
        { value: "0-17", label: "0-17 years" },
        { value: "18-25", label: "18-25 years" },
        { value: "26-35", label: "26-35 years" },
        { value: "36-45", label: "36-45 years" },
        { value: "46-55", label: "46-55 years" },
        { value: "56-65", label: "56-65 years" },
        { value: "65+", label: "65+ years" }
    ]
};

const BeneficiaryList = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState<BeneficiaryFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const LIMIT = 20;

    // Helper function to calculate age from date of birth
    const calculateAge = (dateOfBirth: string): number => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Helper function to check if age falls within range
    const isAgeInRange = (dateOfBirth: string, ageRange: string): boolean => {
        const age = calculateAge(dateOfBirth);
        
        switch (ageRange) {
            case "0-17": return age >= 0 && age <= 17;
            case "18-25": return age >= 18 && age <= 25;
            case "26-35": return age >= 26 && age <= 35;
            case "36-45": return age >= 36 && age <= 45;
            case "46-55": return age >= 46 && age <= 55;
            case "56-65": return age >= 56 && age <= 65;
            case "65+": return age >= 65;
            default: return true;
        }
    };

    // Helper function to apply client-side filtering
    const applyBeneficiaryFilters = (beneficiariesData: BeneficiarySchema[]): BeneficiarySchema[] => {
        return beneficiariesData.filter(beneficiary => {
            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(beneficiary.status)) {
                return false;
            }
            
            // Civil status filter
            if (filters.civil_status.length > 0 && beneficiary.civil_status && !filters.civil_status.includes(beneficiary.civil_status)) {
                return false;
            }
            
            // Age range filter
            if (filters.age_range.length > 0 && beneficiary.birthdate) {
                const matchesAnyRange = filters.age_range.some(range => 
                    isAgeInRange(beneficiary.birthdate, range)
                );
                if (!matchesAnyRange) {
                    return false;
                }
            }
            
            // Date from filter (using created_at)
            if (filters.date_from && beneficiary.created_at) {
                const beneficiaryDate = new Date(beneficiary.created_at);
                if (beneficiaryDate < filters.date_from) {
                    return false;
                }
            }
            
            // Date to filter (using created_at)
            if (filters.date_to && beneficiary.created_at) {
                const beneficiaryDate = new Date(beneficiary.created_at);
                // Set time to end of day for date_to comparison
                const endOfDay = new Date(filters.date_to);
                endOfDay.setHours(23, 59, 59, 999);
                if (beneficiaryDate > endOfDay) {
                    return false;
                }
            }
            
            return true;
        });
    };

    const getHousingList = useCallback(
        async (filter: string = "") => {
            try {
                const organizationId = pathname.split("/")[3];

                if (organizationId) {
                    // Get all beneficiaries first (with a higher limit to ensure we get all for filtering)
                    const response = await getBeneficiariesByOrganizationID(
                        organizationId,
                        0, // Always start from 0 to get all beneficiaries for filtering
                        1000, // Get more beneficiaries to apply filters client-side
                        filter
                    );
                    
                    // Apply client-side filtering
                    const allBeneficiaries = response.data.data || [];
                    const filteredBeneficiaries = applyBeneficiaryFilters(allBeneficiaries);
                    
                    // Apply pagination to filtered results
                    const startIndex = offset;
                    const endIndex = offset + LIMIT;
                    const paginatedBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);
                    
                    // Update beneficiaries with paginated filtered results
                    setBeneficiaries({
                        count: filteredBeneficiaries.length,
                        data: paginatedBeneficiaries
                    });
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        },
        [pathname, offset, filters]
    );

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getHousingList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getHousingList]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setOffset(0); // Reset to first page when searching
    };

    const handleFilterChange = (filterType: keyof BeneficiaryFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setOffset(0); // Reset to first page when filtering
    };

    const addFilterValue = (filterType: keyof BeneficiaryFilters, value: string) => {
        if (filterType === 'date_from' || filterType === 'date_to') return;
        
        const currentValues = filters[filterType] as string[];
        if (!currentValues.includes(value)) {
            handleFilterChange(filterType, [...currentValues, value]);
        }
    };

    const removeFilterValue = (filterType: keyof BeneficiaryFilters, value: string) => {
        if (filterType === 'date_from' || filterType === 'date_to') {
            handleFilterChange(filterType, null);
            return;
        }
        
        const currentValues = filters[filterType] as string[];
        handleFilterChange(filterType, currentValues.filter(v => v !== value));
    };

    const clearAllFilters = () => {
        setFilters(initialFilters);
        setOffset(0);
    };

    const getActiveFiltersCount = () => {
        const counts = [
            filters.status.length,
            filters.civil_status.length,
            filters.age_range.length,
            filters.date_from ? 1 : 0,
            filters.date_to ? 1 : 0
        ];
        return counts.reduce((sum, count) => sum + count, 0);
    };

    useEffect(() => {
        setIsLoading(true);
        getHousingList();
    }, [offset, getHousingList]);

    const totalPages = beneficiaries ? Math.ceil(beneficiaries.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <>
            <div className="flex items-end gap-4 justify-between lg:flex-row-reverse">
                <div className="relative lg:grow">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                    <Input
                        type="text"
                        placeholder={dict.commons.beneficiaries.list.searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-[300px] lg:w-full pl-10"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter Dropdown */}
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
                                    <h4 className="font-medium text-sm">Filter Beneficiaries</h4>
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
                                        <label className="text-xs font-medium text-slate-700">Status</label>
                                        <Select onValueChange={(value) => addFilterValue('status', value)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select status..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.status.map(option => (
                                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Civil Status Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">Civil Status</label>
                                        <Select onValueChange={(value) => addFilterValue('civil_status', value)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select civil status..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.civil_status.map(option => (
                                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Age Range Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">Age Range</label>
                                        <Select onValueChange={(value) => addFilterValue('age_range', value)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select age range..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.age_range.map(option => (
                                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    {/* Date Filters */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-slate-700">Date Range</label>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Date From */}
                                            <div className="space-y-1">
                                                <label className="text-xs text-slate-600">From</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-8 justify-start text-left font-normal text-xs"
                                                        >
                                                            <FaCalendarAlt className="mr-1 h-3 w-3" />
                                                            {filters.date_from ? format(filters.date_from, "MMM dd") : "Pick..."}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={filters.date_from || undefined}
                                                            onSelect={(date) => handleFilterChange('date_from', date || null)}
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
                                                            {filters.date_to ? format(filters.date_to, "MMM dd") : "Pick..."}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={filters.date_to || undefined}
                                                            onSelect={(date) => handleFilterChange('date_to', date || null)}
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

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center py-2">
                    <span className="text-xs font-medium text-slate-600">Active filters:</span>
                    
                    {/* Status badges */}
                    {filters.status.map(status => (
                        <Badge key={`status-${status}`} variant="secondary" className="text-xs h-6">
                            Status: {filterOptions.status.find(o => o.value === status)?.label}
                            <button
                                onClick={() => removeFilterValue('status', status)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Civil Status badges */}
                    {filters.civil_status.map(civilStatus => (
                        <Badge key={`civil-status-${civilStatus}`} variant="secondary" className="text-xs h-6">
                            Civil Status: {filterOptions.civil_status.find(o => o.value === civilStatus)?.label}
                            <button
                                onClick={() => removeFilterValue('civil_status', civilStatus)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {/* Age Range badges */}
                    {filters.age_range.map(ageRange => (
                        <Badge key={`age-range-${ageRange}`} variant="secondary" className="text-xs h-6">
                            Age: {filterOptions.age_range.find(o => o.value === ageRange)?.label}
                            <button
                                onClick={() => removeFilterValue('age_range', ageRange)}
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
                                onClick={() => removeFilterValue('date_from', '')}
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
                                onClick={() => removeFilterValue('date_to', '')}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                </div>
            )}
            <div className="h-[calc(100vh-172px)] lg:h-[calc(100vh-122px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.commons.beneficiaries.list.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.commons.beneficiaries.list.error}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.count <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        {dict.commons.beneficiaries.list.noBeneficiariesFound}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.count > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {beneficiaries?.data.map(beneficiary => (
                                <Card
                                    key={beneficiary.id}
                                    {...beneficiary}
                                    refreshList={getHousingList}
                                />
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

export { BeneficiaryList };
