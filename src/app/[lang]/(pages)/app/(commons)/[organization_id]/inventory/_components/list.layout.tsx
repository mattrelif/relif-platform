"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { getProductsByOrganizationID, getInventoryStats } from "@/repository/organization.repository";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { MdError, MdAdd } from "react-icons/md";
import { FaBoxes, FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";
import { StatisticsCards } from "@/components/ui/statistics-cards";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";

import { Card } from "./card.layout";
import { Toolbar } from "./toolbar.layout";
import { ProductSchema } from "@/types/product.types";

// Filter types
interface InventoryFilters {
    category: string[];
    stock_status: string[];
}

const initialFilters: InventoryFilters = {
    category: [],
    stock_status: [],
};

const ProductList = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const dict = useDictionary();

    const [products, setProducts] = useState<{
        count: number;
        data: ProductSchema[];
    } | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleFilterAdd = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: [...prev[filterType as keyof InventoryFilters], value]
        }));
    };

    const handleFilterRemove = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType as keyof InventoryFilters].filter(v => v !== value)
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

        // Category filters
        filters.category.forEach(category => {
            const categoryOptions = [
                { value: "foodAndBeverages", label: "Food and Beverages" },
                { value: "personalCareAndBeauty", label: "Personal Care and Beauty" },
                { value: "householdCleaning", label: "Household Cleaning" },
                { value: "babyCareProducts", label: "Baby Care Products" },
                { value: "petProducts", label: "Pet Products" },
                { value: "pharmacyAndMedications", label: "Pharmacy and Medications" },
            ];
            const option = categoryOptions.find(opt => opt.value === category);
            if (option) {
                activeFilters.push({
                    type: 'category',
                    value: category,
                    label: option.label,
                    displayLabel: `Category: ${option.label}`
                });
            }
        });

        // Stock status filters
        filters.stock_status.forEach(stockStatus => {
            const stockOptions = [
                { value: "in_stock", label: "In Stock" },
                { value: "low_stock", label: "Low Stock" },
                { value: "out_of_stock", label: "Out of Stock" },
            ];
            const option = stockOptions.find(opt => opt.value === stockStatus);
            if (option) {
                activeFilters.push({
                    type: 'stock_status',
                    value: stockStatus,
                    label: option.label,
                    displayLabel: `Stock: ${option.label}`
                });
            }
        });

        return activeFilters;
    };

    // Helper function to apply client-side filtering
    const applyInventoryFilters = (
        productsData: ProductSchema[]
    ): ProductSchema[] => {
        return productsData.filter(product => {
            // Category filter
            if (filters.category.length > 0 && !filters.category.includes(product.category)) {
                return false;
            }

            // Stock status filter (based on total_in_storage)
            if (filters.stock_status.length > 0) {
                const stockStatus = product.total_in_storage === 0 
                    ? 'out_of_stock' 
                    : product.total_in_storage <= 10 
                        ? 'low_stock' 
                        : 'in_stock';
                
                if (!filters.stock_status.includes(stockStatus)) {
                    return false;
                }
            }

            return true;
        });
    };

    const getProductList = useCallback(
        async (filter: string = "") => {
            try {
                setIsLoading(true);
                setError(false);

                const organizationId = pathname.split("/")[3];

                if (organizationId) {
                    // Get all products first (with a higher limit to ensure we get all for filtering)
                    const response = await getProductsByOrganizationID(
                        organizationId,
                        0, // Always start from 0 to get all products for filtering
                        1000, // Get more products to apply filters client-side
                        filter
                    );

                    // Apply client-side filtering
                    const allProducts = response.data.data || [];
                    const filteredProducts = applyInventoryFilters(allProducts);

                    // Update products with filtered results (no pagination for now)
                    setProducts({
                        count: filteredProducts.length,
                        data: filteredProducts,
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
        [pathname, filters]
    );

    const getInventoryStatsData = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            const organizationId = pathname.split("/")[3];
            if (organizationId) {
                const response = await getInventoryStats(organizationId);
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching inventory stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    }, [pathname]);

    useEffect(() => {
        getInventoryStatsData();
    }, [getInventoryStatsData]);

    useEffect(() => {
        setIsLoading(true);
        getProductList();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getProductList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getProductList]);

    // DEV MOCK: Always inject mock products in development mode if error or no data
    let productsData = products?.data || [];
    if (process.env.NODE_ENV === 'development' && (error || productsData.length === 0)) {
        const mockOrg = {
            id: 'mock-org-1',
            name: 'Mock Org',
            description: '',
            address: {
                address_line_1: '1 Org St',
                address_line_2: '',
                city: 'Testville',
                zip_code: '12345',
                district: 'Central',
                country: 'Testland',
            },
            type: 'NGO',
            creator_id: 'mock-user-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        productsData = [
            {
                id: 'mock-product-1',
                name: 'Mock Rice',
                brand: 'MockBrand',
                category: 'foodAndBeverages',
                description: 'A bag of rice',
                total_in_storage: 20,
                organization_id: 'mock-org-1',
                organization: mockOrg,
                unit_type: 'kg',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'mock-product-2',
                name: 'Mock Soap',
                brand: 'CleanBrand',
                category: 'personalCareAndBeauty',
                description: 'Bar of soap',
                total_in_storage: 5,
                organization_id: 'mock-org-1',
                organization: mockOrg,
                unit_type: 'pcs',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'mock-product-3',
                name: 'Mock Medicine',
                brand: 'HealthBrand',
                category: 'pharmacyAndMedications',
                description: 'Pain relief tablets',
                total_in_storage: 0,
                organization_id: 'mock-org-1',
                organization: mockOrg,
                unit_type: 'box',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    }

    // Calculate stats from the final productsData
    const total = productsData.length;
    const inStock = productsData.filter(p => p.total_in_storage > 10).length;
    const lowStock = productsData.filter(p => p.total_in_storage > 0 && p.total_in_storage <= 10).length;
    const outOfStock = productsData.filter(p => p.total_in_storage === 0).length;

    // Use productsData for both the stats and the list rendering
    const statisticsCards = [
        {
            title: "Total Products",
            value: isLoading ? "..." : total,
            icon: <FaBoxes />,
            color: "blue" as const,
            isLoading,
        },
        {
            title: "In Stock",
            value: isLoading ? "..." : inStock,
            icon: <FaCheckCircle />,
            color: "green" as const,
            isLoading,
        },
        {
            title: "Low Stock",
            value: isLoading ? "..." : lowStock,
            icon: <FaExclamationTriangle />,
            color: "orange" as const,
            isLoading,
        },
        {
            title: "Out of Stock",
            value: isLoading ? "..." : outOfStock,
            icon: <FaClock />,
            color: "red" as const,
            isLoading,
        },
    ];

    const handleCreateProduct = () => {
        const organizationId = pathname.split("/")[3];
        router.push(`/${pathname.split("/")[1]}/app/${organizationId}/inventory/create`);
    };

    return (
        <>
            {/* Statistics Cards */}
            <StatisticsCards cards={statisticsCards} />

            {/* Search and Filter Bar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder={dict.commons.inventory.list.searchPlaceholder}
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                filterSections={[
                    {
                        key: "category",
                        label: "Category",
                        options: [
                            { value: "foodAndBeverages", label: "Food and Beverages" },
                            { value: "personalCareAndBeauty", label: "Personal Care and Beauty" },
                            { value: "householdCleaning", label: "Household Cleaning" },
                            { value: "babyCareProducts", label: "Baby Care Products" },
                            { value: "petProducts", label: "Pet Products" },
                            { value: "pharmacyAndMedications", label: "Pharmacy and Medications" },
                        ],
                        placeholder: "Select category...",
                    },
                    {
                        key: "stock_status",
                        label: "Stock Status",
                        options: [
                            { value: "in_stock", label: "In Stock" },
                            { value: "low_stock", label: "Low Stock" },
                            { value: "out_of_stock", label: "Out of Stock" },
                        ],
                        placeholder: "Select stock status...",
                    },
                ]}
                filterTitle="Filter Inventory"
                onFilterAdd={handleFilterAdd}
                onFilterRemove={handleFilterRemove}
                onFilterClear={handleFilterClear}
                activeFiltersCount={getActiveFiltersCount()}
                activeFilters={getActiveFilters()}
                additionalActions={<Toolbar organizationId={pathname.split("/")[3]} />}
            />
                    {/* Inventory List */}
            <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-300px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col overflow-hidden">
            {/* <div className="p-4 flex items-center justify-between gap-3 border-b-[1px] border-slate-200"> */}
            {/*    <div className="flex items-center gap-2"> */}
            {/*        <MdSearch className="text-slate-400 text-2xl mr-2" /> */}
            {/*        <Select defaultValue="name"> */}
            {/*            <SelectTrigger className="w-[120px]"> */}
            {/*                <SelectValue placeholder="Select..." /> */}
            {/*            </SelectTrigger> */}
            {/*            <SelectContent> */}
            {/*                <SelectItem value="reference">Reference</SelectItem> */}
            {/*                <SelectItem value="name">Name</SelectItem> */}
            {/*            </SelectContent> */}
            {/*        </Select> */}
            {/*        <Input type="text" placeholder="Search..." className="w-[300px] lg:w-full" /> */}
            {/*    </div> */}

            {/*    <div> */}
            {/*        <Select> */}
            {/*            <SelectTrigger className="w-[180px]"> */}
            {/*                <SelectValue placeholder="Category..." /> */}
            {/*            </SelectTrigger> */}
            {/*            <SelectContent> */}
            {/*                <SelectItem value="foodAndBeverages">Food and Beverages</SelectItem> */}
            {/*                <SelectItem value="personalCareAndBeauty"> */}
            {/*                    Personal Care and Beauty */}
            {/*                </SelectItem> */}
            {/*                <SelectItem value="householdCleaning">Household Cleaning</SelectItem> */}
            {/*                <SelectItem value="babyCareProducts">Baby Care Products</SelectItem> */}
            {/*                <SelectItem value="petProducts">Pet Products</SelectItem> */}
            {/*                <SelectItem value="pharmacyAndMedications"> */}
            {/*                    Pharmacy and Medications */}
            {/*                </SelectItem> */}
            {/*            </SelectContent> */}
            {/*        </Select> */}
            {/*    </div> */}
            {/* </div> */}



            {isLoading && (
                <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                    {dict.commons.inventory.list.loading}
                </h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                    <MdError />
                    {dict.commons.inventory.list.error}
                </span>
            )}

            {!isLoading && !error && products && products.data.length <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-4">
                    {dict.commons.inventory.list.noProducts}
                </span>
            )}

            {!isLoading && !error && products && products.data.length > 0 && (
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    {products?.data.map(product => (
                        <Card {...product} refreshList={getProductList} key={product.id} />
                    ))}
                </ul>
            )}
            </div>
        </>
    );
};

export { ProductList };
