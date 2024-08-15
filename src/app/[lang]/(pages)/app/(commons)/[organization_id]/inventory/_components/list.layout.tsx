"use client";

import { getProductsByOrganizationID } from "@/repository/organization.repository";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { Card } from "./card.layout";

const ProductList = (): ReactNode => {
    const pathname = usePathname();

    const [products, setProducts] = useState<{
        count: number;
        data: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const getProductList = async () => {
        try {
            setIsLoading(true);
            setError(false);

            const organizationId = pathname.split("/")[3];

            if (organizationId) {
                const response = await getProductsByOrganizationID(organizationId, OFFSET, LIMIT);
                setProducts(response.data);
            } else {
                throw new Error();
            }
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getProductList();
    }, []);

    return (
        <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
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
                <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!isLoading && !error && products && products.data.length <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-4">No products found...</span>
            )}

            {!isLoading && !error && products && products.data.length > 0 && (
                <>
                    <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                        {products?.data.map(product => (
                            <Card {...product} refreshList={getProductList} />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export { ProductList };
