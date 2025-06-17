"use client";

import { Toolbar } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/volunteers/_components/toolbar.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getVoluntariesByOrganizationID, getVolunteerStats } from "@/repository/organization.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdAdd } from "react-icons/md";
import { FaUsers, FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
import { StatisticsCards } from "@/components/ui/statistics-cards";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";

import { Card } from "./card.layout";

// Filter types
interface VolunteerFilters {
    status: string[];
    skills: string[];
}

const initialFilters: VolunteerFilters = {
    status: [],
    skills: [],
};

const VolunteersList = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const dict = useDictionary();
    const organizationId = pathname.split("/")[3];

    const [volunteers, setVolunteers] = useState<{
        count: number;
        data: VoluntarySchema[];
    } | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState<VolunteerFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const LIMIT = 20;

    // Helper function to apply client-side filtering
    const applyVolunteerFilters = (
        volunteersData: VoluntarySchema[]
    ): VoluntarySchema[] => {
        return volunteersData.filter(volunteer => {
            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(volunteer.status)) {
                return false;
            }

            // Skills filter (using segments property)
            if (filters.skills.length > 0 && volunteer.segments) {
                const hasMatchingSkill = filters.skills.some(skill => 
                    volunteer.segments.includes(skill)
                );
                if (!hasMatchingSkill) {
                    return false;
                }
            }

            return true;
        });
    };

    const getVoluntaryList = useCallback(
        async (filter: string = "") => {
            try {
                const organizationId = pathname.split("/")[3];

                if (organizationId) {
                    // Get all volunteers first (with a higher limit to ensure we get all for filtering)
                    const response = await getVoluntariesByOrganizationID(
                        organizationId,
                        0, // Always start from 0 to get all volunteers for filtering
                        1000, // Get more volunteers to apply filters client-side
                        filter
                    );

                    // Apply client-side filtering
                    const allVolunteers = response.data.data || [];
                    const filteredVolunteers = applyVolunteerFilters(allVolunteers);

                    // Apply pagination to filtered results
                    const startIndex = offset;
                    const endIndex = offset + LIMIT;
                    const paginatedVolunteers = filteredVolunteers.slice(
                        startIndex,
                        endIndex
                    );

                    // Update volunteers with paginated filtered results
                    setVolunteers({
                        count: filteredVolunteers.length,
                        data: paginatedVolunteers,
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
            getVoluntaryList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getVoluntaryList]);

    const getVolunteerStatsData = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            if (organizationId) {
                const response = await getVolunteerStats(organizationId);
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching volunteer stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    }, [organizationId]);

    useEffect(() => {
        getVolunteerStatsData();
    }, [getVolunteerStatsData]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleFilterAdd = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: [...prev[filterType as keyof VolunteerFilters], value]
        }));
    };

    const handleFilterRemove = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType as keyof VolunteerFilters].filter(v => v !== value)
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
                { value: "active", label: "Active" },
                { value: "pending", label: "Pending" },
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

        // Skills filters
        filters.skills.forEach(skill => {
            const skillOptions = [
                { value: "counseling", label: "Counseling" },
                { value: "translation", label: "Translation" },
                { value: "medical", label: "Medical" },
                { value: "legal", label: "Legal" },
                { value: "education", label: "Education" },
            ];
            const option = skillOptions.find(opt => opt.value === skill);
            if (option) {
                activeFilters.push({
                    type: 'skills',
                    value: skill,
                    label: option.label,
                    displayLabel: `Skill: ${option.label}`
                });
            }
        });

        return activeFilters;
    };

    useEffect(() => {
        setIsLoading(true);
        getVoluntaryList();
    }, [offset, getVoluntaryList]);

    const totalPages = volunteers ? Math.ceil(volunteers.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    // DEV MOCK: Always inject mock volunteers in development mode if error or no data
    let volunteersData = volunteers?.data || [];
    if (process.env.NODE_ENV === 'development' && (error || volunteersData.length === 0)) {
        volunteersData = [
            {
                id: 'mock-volunteer-1',
                organization_id: 'mock-org-1',
                full_name: 'Jane Volunteer',
                email: 'jane@volunteer.com',
                gender: 'FEMALE',
                documents: [],
                birthdate: '1992-03-15',
                phones: ['+1234567890'],
                address: {
                    address_line_1: '456 Volunteer Ave',
                    address_line_2: '',
                    city: 'Testville',
                    zip_code: '12345',
                    district: 'Central',
                    country: 'Testland',
                },
                status: 'active',
                segments: ['counseling', 'education'],
                medical_information: {
                    allergies: [],
                    current_medications: [],
                    recurrent_medical_conditions: [],
                    health_insurance_plans: [],
                    blood_type: 'A+',
                    taken_vaccines: [],
                    mental_health_history: [],
                    height: 165,
                    weight: 60,
                    addictions: [],
                    disabilities: [],
                    prothesis_or_medical_devices: [],
                },
                emergency_contacts: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                notes: '',
            },
            {
                id: 'mock-volunteer-2',
                organization_id: 'mock-org-1',
                full_name: 'Bob Helper',
                email: 'bob@volunteer.com',
                gender: 'MALE',
                documents: [],
                birthdate: '1988-07-22',
                phones: ['+1987654321'],
                address: {
                    address_line_1: '789 Helper Rd',
                    address_line_2: '',
                    city: 'Testville',
                    zip_code: '12345',
                    district: 'Central',
                    country: 'Testland',
                },
                status: 'pending',
                segments: ['translation'],
                medical_information: {
                    allergies: [],
                    current_medications: [],
                    recurrent_medical_conditions: [],
                    health_insurance_plans: [],
                    blood_type: 'B-',
                    taken_vaccines: [],
                    mental_health_history: [],
                    height: 180,
                    weight: 80,
                    addictions: [],
                    disabilities: [],
                    prothesis_or_medical_devices: [],
                },
                emergency_contacts: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                notes: '',
            },
        ];
    }

    // Calculate stats from the final volunteersData
    const total = volunteersData.length;
    const active = volunteersData.filter(v => v.status === 'active').length;
    const pending = volunteersData.filter(v => v.status === 'pending').length;
    const inactive = volunteersData.filter(v => v.status === 'inactive').length;

    // Use volunteersData for both the stats and the list rendering
    const statisticsCards = [
        {
            title: "Total Volunteers",
            value: isLoading ? "..." : total,
            icon: <FaUsers />,
            color: "blue" as const,
            isLoading,
        },
        {
            title: "Active",
            value: isLoading ? "..." : active,
            icon: <FaUserCheck />,
            color: "green" as const,
            isLoading,
        },
        {
            title: "Pending",
            value: isLoading ? "..." : pending,
            icon: <FaUserClock />,
            color: "orange" as const,
            isLoading,
        },
        {
            title: "Inactive",
            value: isLoading ? "..." : inactive,
            icon: <FaUserTimes />,
            color: "red" as const,
            isLoading,
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
                searchPlaceholder={dict.commons.volunteers.list.search}
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                filterSections={[
                    {
                        key: "status",
                        label: "Status",
                        options: [
                            { value: "active", label: "Active" },
                            { value: "pending", label: "Pending" },
                            { value: "inactive", label: "Inactive" },
                        ],
                        placeholder: "Select status...",
                    },
                    {
                        key: "skills",
                        label: "Skills",
                        options: [
                            { value: "counseling", label: "Counseling" },
                            { value: "translation", label: "Translation" },
                            { value: "medical", label: "Medical" },
                            { value: "legal", label: "Legal" },
                            { value: "education", label: "Education" },
                        ],
                        placeholder: "Select skills...",
                    },
                ]}
                filterTitle="Filter Volunteers"
                onFilterAdd={handleFilterAdd}
                onFilterRemove={handleFilterRemove}
                onFilterClear={handleFilterClear}
                activeFiltersCount={getActiveFiltersCount()}
                activeFilters={getActiveFilters()}
                additionalActions={<Toolbar />}
            />

            {/* Volunteers List */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-300px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.commons.volunteers.list.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.commons.volunteers.list.error}
                    </span>
                )}

                {!isLoading && !error && volunteers && volunteers.data.length <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        {dict.commons.volunteers.list.noVolunteersFound}
                    </span>
                )}

                {!isLoading && !error && volunteers && volunteers.data.length > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {volunteers?.data.map(voluntary => (
                                <Card
                                    key={voluntary.id}
                                    {...voluntary}
                                    refreshList={getVoluntaryList}
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

export { VolunteersList };
