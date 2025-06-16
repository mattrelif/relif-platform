"use client";

import { Toolbar } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/_components/toolbar.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getBeneficiariesByOrganizationID, getBeneficiaryStats } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdAdd } from "react-icons/md";
import { FaUsers, FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
import { StatisticsCards } from "@/components/ui/statistics-cards";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";

import { Card } from "./card.layout";

// Filter types
interface BeneficiaryFilters {
    status: string[];
    civil_status: string[];
    age_range: string[];
    gender: string[];
    housing_status: string[];
    education: string[];
    date_from: Date | null;
    date_to: Date | null;
    age_min: number | null;
    age_max: number | null;
}

const initialFilters: BeneficiaryFilters = {
    status: [],
    civil_status: [],
    age_range: [],
    gender: [],
    housing_status: [],
    education: [],
    date_from: null,
    date_to: null,
    age_min: null,
    age_max: null,
};

// Available filter options
const filterOptions = {
    status: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
        { value: "PENDING", label: "Pending" },
        { value: "ARCHIVED", label: "Archived" },
    ],
    civil_status: [
        { value: "SINGLE", label: "Single" },
        { value: "MARRIED", label: "Married" },
        { value: "DIVORCED", label: "Divorced" },
        { value: "WIDOWED", label: "Widowed" },
        { value: "SEPARATED", label: "Separated" },
        { value: "COMMON_LAW", label: "Common Law" },
        { value: "IN_RELATIONSHIP", label: "In Relationship" },
    ],
    age_range: [
        { value: "0-17", label: "0-17 years (Minors)" },
        { value: "18-25", label: "18-25 years (Young Adults)" },
        { value: "26-35", label: "26-35 years" },
        { value: "36-45", label: "36-45 years" },
        { value: "46-55", label: "46-55 years" },
        { value: "56-65", label: "56-65 years" },
        { value: "65+", label: "65+ years (Seniors)" },
    ],
    gender: [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
        { value: "NON_BINARY", label: "Non-Binary" },
        { value: "TRANSGENDER", label: "Transgender" },
        { value: "PREFER_NOT_TO_SAY", label: "Prefer Not to Say" },
        { value: "OTHER", label: "Other" },
    ],
    housing_status: [
        { value: "ALLOCATED", label: "Allocated to Housing" },
        { value: "UNALLOCATED", label: "Unallocated" },
        { value: "TEMPORARY", label: "Temporary Housing" },
        { value: "PERMANENT", label: "Permanent Housing" },
    ],
    education: [
        { value: "NO_EDUCATION", label: "No Formal Education" },
        { value: "PRIMARY", label: "Primary Education" },
        { value: "SECONDARY", label: "Secondary Education" },
        { value: "HIGH_SCHOOL", label: "High School" },
        { value: "VOCATIONAL", label: "Vocational Training" },
        { value: "UNIVERSITY", label: "University" },
        { value: "POSTGRADUATE", label: "Postgraduate" },
    ],
};

const BeneficiaryList = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const dict = useDictionary();

    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
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
            case "0-17":
                return age >= 0 && age <= 17;
            case "18-25":
                return age >= 18 && age <= 25;
            case "26-35":
                return age >= 26 && age <= 35;
            case "36-45":
                return age >= 36 && age <= 45;
            case "46-55":
                return age >= 46 && age <= 55;
            case "56-65":
                return age >= 56 && age <= 65;
            case "65+":
                return age >= 65;
            default:
                return true;
        }
    };

    // Helper function to apply client-side filtering
    const applyBeneficiaryFilters = (
        beneficiariesData: BeneficiarySchema[]
    ): BeneficiarySchema[] => {
        return beneficiariesData.filter(beneficiary => {
            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(beneficiary.status)) {
                return false;
            }

            // Civil status filter
            if (
                filters.civil_status.length > 0 &&
                beneficiary.civil_status &&
                !filters.civil_status.includes(beneficiary.civil_status)
            ) {
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

            // Custom age range filter
            if ((filters.age_min !== null || filters.age_max !== null) && beneficiary.birthdate) {
                const age = calculateAge(beneficiary.birthdate);
                if (filters.age_min !== null && age < filters.age_min) {
                    return false;
                }
                if (filters.age_max !== null && age > filters.age_max) {
                    return false;
                }
            }

            // Gender filter
            if (
                filters.gender.length > 0 &&
                beneficiary.gender &&
                !filters.gender.includes(beneficiary.gender.toUpperCase())
            ) {
                return false;
            }

            // Housing status filter
            if (filters.housing_status.length > 0) {
                const isAllocated = beneficiary.current_housing_id ? "ALLOCATED" : "UNALLOCATED";
                if (!filters.housing_status.includes(isAllocated)) {
                    return false;
                }
            }

            // Education filter
            if (
                filters.education.length > 0 &&
                beneficiary.education &&
                !filters.education.includes(beneficiary.education.toUpperCase())
            ) {
                return false;
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

    const getBeneficiaryList = useCallback(
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
                    const paginatedBeneficiaries = filteredBeneficiaries.slice(
                        startIndex,
                        endIndex
                    );

                    // Update beneficiaries with paginated filtered results
                    setBeneficiaries({
                        count: filteredBeneficiaries.length,
                        data: paginatedBeneficiaries,
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

    const getBeneficiaryStatsData = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            const organizationId = pathname.split("/")[3];
            if (organizationId) {
                const response = await getBeneficiaryStats(organizationId);
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching beneficiary stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    }, [pathname]);

    useEffect(() => {
        getBeneficiaryStatsData();
    }, [getBeneficiaryStatsData]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getBeneficiaryList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getBeneficiaryList]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setOffset(0); // Reset to first page when searching
    };

    const handleFilterChange = (filterType: keyof BeneficiaryFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value,
        }));
        setOffset(0); // Reset to first page when filtering
    };

    const addFilterValue = (filterType: string, value: string) => {
        const typedFilterType = filterType as keyof BeneficiaryFilters;

        // Handle date filters
        if (filterType === "date_from" || filterType === "date_to") {
            handleFilterChange(typedFilterType, new Date(value));
        }
        // Handle number filters
        else if (filterType === "age_min" || filterType === "age_max") {
            handleFilterChange(typedFilterType, parseInt(value));
        }
        // Handle array filters
        else {
            const currentValues = filters[typedFilterType] as string[];
            if (!currentValues.includes(value)) {
                handleFilterChange(typedFilterType, [...currentValues, value]);
            }
        }
    };

    const removeFilterValue = (filterType: string, value: string) => {
        const typedFilterType = filterType as keyof BeneficiaryFilters;
        
        if (filterType === "date_from" || filterType === "date_to") {
            handleFilterChange(typedFilterType, null);
            return;
        }

        if (filterType === "age_min" || filterType === "age_max") {
            handleFilterChange(typedFilterType, null);
            return;
        }

        const currentValues = filters[typedFilterType] as string[];
        handleFilterChange(
            typedFilterType,
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
            filters.civil_status.length,
            filters.age_range.length,
            filters.gender.length,
            filters.housing_status.length,
            filters.education.length,
            filters.date_from ? 1 : 0,
            filters.date_to ? 1 : 0,
            filters.age_min !== null ? 1 : 0,
            filters.age_max !== null ? 1 : 0,
        ];
        return counts.reduce((sum, count) => sum + count, 0);
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

        // Civil status filters
        filters.civil_status.forEach(civilStatus => {
            const option = filterOptions.civil_status.find(opt => opt.value === civilStatus);
            if (option) {
                activeFilters.push({
                    type: 'civil_status',
                    value: civilStatus,
                    label: option.label,
                    displayLabel: `Civil Status: ${option.label}`
                });
            }
        });

        // Age range filters
        filters.age_range.forEach(ageRange => {
            const option = filterOptions.age_range.find(opt => opt.value === ageRange);
            if (option) {
                activeFilters.push({
                    type: 'age_range',
                    value: ageRange,
                    label: option.label,
                    displayLabel: `Age Range: ${option.label}`
                });
            }
        });

        // Gender filters
        filters.gender.forEach(gender => {
            const option = filterOptions.gender.find(opt => opt.value === gender);
            if (option) {
                activeFilters.push({
                    type: 'gender',
                    value: gender,
                    label: option.label,
                    displayLabel: `Gender: ${option.label}`
                });
            }
        });

        // Housing status filters
        filters.housing_status.forEach(housingStatus => {
            const option = filterOptions.housing_status.find(opt => opt.value === housingStatus);
            if (option) {
                activeFilters.push({
                    type: 'housing_status',
                    value: housingStatus,
                    label: option.label,
                    displayLabel: `Housing: ${option.label}`
                });
            }
        });

        // Education filters
        filters.education.forEach(education => {
            const option = filterOptions.education.find(opt => opt.value === education);
            if (option) {
                activeFilters.push({
                    type: 'education',
                    value: education,
                    label: option.label,
                    displayLabel: `Education: ${option.label}`
                });
            }
        });

        // Date filters
        if (filters.date_from) {
            activeFilters.push({
                type: 'date_from',
                value: filters.date_from.toISOString(),
                label: filters.date_from.toLocaleDateString(),
                displayLabel: `From: ${filters.date_from.toLocaleDateString()}`
            });
        }

        if (filters.date_to) {
            activeFilters.push({
                type: 'date_to',
                value: filters.date_to.toISOString(),
                label: filters.date_to.toLocaleDateString(),
                displayLabel: `To: ${filters.date_to.toLocaleDateString()}`
            });
        }

        // Age filters
        if (filters.age_min !== null) {
            activeFilters.push({
                type: 'age_min',
                value: filters.age_min.toString(),
                label: filters.age_min.toString(),
                displayLabel: `Min Age: ${filters.age_min}`
            });
        }

        if (filters.age_max !== null) {
            activeFilters.push({
                type: 'age_max',
                value: filters.age_max.toString(),
                label: filters.age_max.toString(),
                displayLabel: `Max Age: ${filters.age_max}`
            });
        }

        return activeFilters;
    };

    useEffect(() => {
        setIsLoading(true);
        getBeneficiaryList();
    }, [offset, getBeneficiaryList]);

    const totalPages = beneficiaries ? Math.ceil(beneficiaries.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    const activeFiltersCount = getActiveFiltersCount();

    // Statistics cards data
    const statisticsCards = [
        {
            title: "Total Beneficiaries",
            value: stats?.total_beneficiaries || 0,
            icon: <FaUsers />,
            color: "blue" as const,
            isLoading: isLoadingStats,
        },
        {
            title: "Active",
            value: stats?.active_beneficiaries || 0,
            icon: <FaUserCheck />,
            color: "green" as const,
            isLoading: isLoadingStats,
        },
        {
            title: "Pending",
            value: stats?.pending_beneficiaries || 0,
            icon: <FaUserClock />,
            color: "orange" as const,
            isLoading: isLoadingStats,
        },
        {
            title: "Inactive",
            value: stats?.inactive_beneficiaries || 0,
            icon: <FaUserTimes />,
            color: "red" as const,
            isLoading: isLoadingStats,
        },
    ];

    // Filter sections for the search bar
    const filterSections = [
        {
            key: "status",
            label: "Status",
            options: filterOptions.status,
            placeholder: "Select status...",
        },
        {
            key: "civil_status",
            label: "Civil Status",
            options: filterOptions.civil_status,
            placeholder: "Select civil status...",
        },
        {
            key: "age_range",
            label: "Age Range",
            options: filterOptions.age_range,
            placeholder: "Select age range...",
        },
        {
            key: "gender",
            label: "Gender",
            options: filterOptions.gender,
            placeholder: "Select gender...",
        },
        {
            key: "housing_status",
            label: "Housing Status",
            options: filterOptions.housing_status,
            placeholder: "Select housing status...",
        },
        {
            key: "education",
            label: "Education Level",
            options: filterOptions.education,
            placeholder: "Select education level...",
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
            key: "age_min",
            label: "Min Age",
            type: "number" as const,
            placeholder: "Min age...",
            min: 0,
            max: 120,
        },
        {
            key: "age_max",
            label: "Max Age",
            type: "number" as const,
            placeholder: "Max age...",
            min: 0,
            max: 120,
        },
    ];



    return (
        <>
            {/* Statistics Cards */}
            <StatisticsCards cards={statisticsCards} />

            {/* Search and Filter Bar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder={dict.commons.beneficiaries.list.searchPlaceholder}
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                filterSections={filterSections}
                filterTitle="Filter Beneficiaries"
                onFilterAdd={addFilterValue}
                onFilterRemove={removeFilterValue}
                onFilterClear={clearAllFilters}
                activeFiltersCount={activeFiltersCount}
                activeFilters={getActiveFilters()}
                additionalActions={<Toolbar />}
            />
            {/* Beneficiaries List */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-300px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
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
                                    refreshList={getBeneficiaryList}
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
