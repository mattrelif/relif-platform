"use client";

import { Toolbar } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/housings/_components/toolbar.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { findHousingsByOrganizationId, getHousingStats } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdAdd } from "react-icons/md";
import { FaHome, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { StatisticsCards } from "@/components/ui/statistics-cards";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";

import { Card } from "./card.layout";

// Filter types
interface HousingFilters {
    status: string[];
    occupancy: string[];
}

const initialFilters: HousingFilters = {
    status: [],
    occupancy: [],
};

const HousingList = (): ReactNode => {
    const dict = useDictionary();
    const pathname = usePathname();
    const router = useRouter();
    const organizationId = pathname.split("/")[3];

    const [housings, setHousings] = useState<{ count: number; data: HousingSchema[] } | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState<HousingFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const LIMIT = 15;

    // Helper function to apply client-side filtering
    const applyHousingFilters = (
        housingsData: HousingSchema[]
    ): HousingSchema[] => {
        return housingsData.filter(housing => {
            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(housing.status)) {
                return false;
            }

            // Occupancy filter (based on occupied vs total vacancies)
            if (filters.occupancy.length > 0) {
                const occupancyStatus = housing.occupied_vacancies === housing.total_vacancies 
                    ? 'full' 
                    : housing.occupied_vacancies > 0 
                        ? 'partial' 
                        : 'empty';
                
                if (!filters.occupancy.includes(occupancyStatus)) {
                    return false;
                }
            }

            return true;
        });
    };

    const getHousingList = useCallback(
        async (filter: string = "") => {
            try {
                if (organizationId) {
                    const response = await findHousingsByOrganizationId(
                        organizationId,
                        offset,
                        LIMIT,
                        filter
                    );
                    setHousings(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        },
        [offset, pathname]
    );

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getHousingList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getHousingList]);

    const getHousingStatsData = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            if (organizationId) {
                const response = await getHousingStats(organizationId);
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching housing stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    }, [organizationId]);

    useEffect(() => {
        getHousingStatsData();
    }, [getHousingStatsData]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    useEffect(() => {
        setIsLoading(true);
        getHousingList();
    }, [offset, getHousingList]);

    const totalPages = housings ? Math.ceil(housings.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    // DEV MOCK: Always inject mock housings in development mode if error or no data
    let housingsData = housings?.data || [];
    if (process.env.NODE_ENV === 'development' && (error || housingsData.length === 0)) {
        housingsData = [
            {
                id: 'mock-housing-1',
                organization_id: 'mock-org-1',
                name: 'Mock Housing 1',
                status: 'available',
                address: {
                    address_line_1: '123 Main St',
                    address_line_2: '',
                    city: 'Testville',
                    zip_code: '12345',
                    district: 'Central',
                    country: 'Testland',
                },
                occupied_vacancies: 2,
                total_vacancies: 10,
                total_rooms: 5,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'mock-housing-2',
                organization_id: 'mock-org-1',
                name: 'Mock Housing 2',
                status: 'occupied',
                address: {
                    address_line_1: '456 Side St',
                    address_line_2: '',
                    city: 'Testville',
                    zip_code: '12345',
                    district: 'Central',
                    country: 'Testland',
                },
                occupied_vacancies: 10,
                total_vacancies: 10,
                total_rooms: 3,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'mock-housing-3',
                organization_id: 'mock-org-1',
                name: 'Mock Housing 3',
                status: 'maintenance',
                address: {
                    address_line_1: '789 Repair Rd',
                    address_line_2: '',
                    city: 'Testville',
                    zip_code: '12345',
                    district: 'Central',
                    country: 'Testland',
                },
                occupied_vacancies: 0,
                total_vacancies: 8,
                total_rooms: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    }

    // Calculate stats from the final housingsData
    const total = housingsData.length;
    const available = housingsData.filter(h => h.status === 'available').length;
    const occupied = housingsData.filter(h => h.status === 'occupied').length;
    const maintenance = housingsData.filter(h => h.status === 'maintenance').length;

    // Use housingsData for both the stats and the list rendering
    const statisticsCards = [
        {
            title: "Total Housing",
            value: isLoading ? "..." : total,
            icon: <FaHome />,
            color: "blue" as const,
            isLoading,
        },
        {
            title: "Available",
            value: isLoading ? "..." : available,
            icon: <FaCheckCircle />,
            color: "green" as const,
            isLoading,
        },
        {
            title: "Occupied",
            value: isLoading ? "..." : occupied,
            icon: <FaClock />,
            color: "orange" as const,
            isLoading,
        },
        {
            title: "Maintenance",
            value: isLoading ? "..." : maintenance,
            icon: <FaExclamationTriangle />,
            color: "red" as const,
            isLoading,
        },
    ];

    const handleFilterAdd = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: [...prev[filterType as keyof HousingFilters], value]
        }));
    };

    const handleFilterRemove = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType as keyof HousingFilters].filter(v => v !== value)
        }));
    };

    const handleFilterClear = () => {
        setFilters(initialFilters);
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
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
            const statusOptions = [
                { value: "available", label: "Available" },
                { value: "occupied", label: "Occupied" },
                { value: "maintenance", label: "Maintenance" },
                { value: "inactive", label: "Inactive" },
            ];
            const option = statusOptions.find(opt => opt.value === status);
            if (option) {
                activeFilters.push({
                    type: 'status',
                    value: status,
                    label: option.label,
                    displayLabel: `Status: ${option.label}`
                });
            }
        });

        // Occupancy filters
        filters.occupancy.forEach(occupancy => {
            const occupancyOptions = [
                { value: "full", label: "Full" },
                { value: "partial", label: "Partial" },
                { value: "empty", label: "Empty" },
            ];
            const option = occupancyOptions.find(opt => opt.value === occupancy);
            if (option) {
                activeFilters.push({
                    type: 'occupancy',
                    value: occupancy,
                    label: option.label,
                    displayLabel: `Occupancy: ${option.label}`
                });
            }
        });

        return activeFilters;
    };

    return (
        <>
            {/* Statistics Cards */}
            <StatisticsCards cards={statisticsCards} />

            {/* Search and Filter Bar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder={dict.housingList.searchPlaceholder}
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                filterSections={[
                    {
                        key: "status",
                        label: "Status",
                        options: [
                            { value: "available", label: "Available" },
                            { value: "occupied", label: "Occupied" },
                            { value: "maintenance", label: "Maintenance" },
                            { value: "inactive", label: "Inactive" },
                        ],
                        placeholder: "Select status...",
                    },
                    {
                        key: "occupancy",
                        label: "Occupancy",
                        options: [
                            { value: "full", label: "Full" },
                            { value: "partial", label: "Partial" },
                            { value: "empty", label: "Empty" },
                        ],
                        placeholder: "Select occupancy...",
                    },
                ]}
                filterTitle="Filter Housing"
                onFilterAdd={handleFilterAdd}
                onFilterRemove={handleFilterRemove}
                onFilterClear={handleFilterClear}
                activeFiltersCount={getActiveFiltersCount()}
                activeFilters={getActiveFilters()}
                additionalActions={<Toolbar organizationId={organizationId} />}
            />

            {/* Housing List */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-300px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.housingList.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.housingList.error}
                    </span>
                )}

                {!isLoading && !error && housings && housings.data.length <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        {dict.housingList.notFound}
                    </span>
                )}

                {!isLoading && !error && housings && housings.data.length > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {housings?.data.map(housing => (
                                <Card key={housing.id} {...housing} refreshList={getHousingList} />
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

export { HousingList };
