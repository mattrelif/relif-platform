"use client";

import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { MdSearch } from "react-icons/md";

import { Card } from "./card.layout";

const ProductList = (): ReactNode => {
    return (
        <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-3 border-b-[1px] border-slate-200">
                <div className="flex items-center gap-2">
                    <MdSearch className="text-slate-400 text-2xl mr-2" />
                    <Select defaultValue="name">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="reference">Reference</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="text" placeholder="Search..." className="w-[300px] lg:w-full" />
                </div>

                <div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="foodAndBeverages">Food and Beverages</SelectItem>
                            <SelectItem value="personalCareAndBeauty">
                                Personal Care and Beauty
                            </SelectItem>
                            <SelectItem value="householdCleaning">Household Cleaning</SelectItem>
                            <SelectItem value="babyCareProducts">Baby Care Products</SelectItem>
                            <SelectItem value="petProducts">Pet Products</SelectItem>
                            <SelectItem value="pharmacyAndMedications">
                                Pharmacy and Medications
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* {isLoading && ( */}
            {/*    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2> */}
            {/* )} */}

            {/* {!isLoading && error && ( */}
            {/*    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4"> */}
            {/*        <MdError /> */}
            {/*        Something went wrong. Please try again later. */}
            {/*    </span> */}
            {/* )} */}

            {/* {!isLoading && !error && housings && housings.data.length <= 0 && ( */}
            {/*    <span className="text-sm text-slate-900 font-medium p-4">No housings found...</span> */}
            {/* )} */}

            {/* {!isLoading && !error && housings && housings.data.length > 0 && ( */}
            <>
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    {/* {housings?.data.map(housing => ( */}
                    <Card />
                    {/* ))} */}
                </ul>
                <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                // onClick={() => handlePageChange(currentPage - 1)}
                                // disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {/* {Array.from({ length: totalPages }).map((_, index) => ( */}
                            <PaginationItem>
                                <PaginationLink
                                // onClick={() => handlePageChange(index + 1)}
                                // isActive={index + 1 === currentPage}
                                >
                                    {/* {index + 1} */}1
                                </PaginationLink>
                            </PaginationItem>
                            {/* ))} */}
                            <PaginationItem>
                                <PaginationNext
                                // onClick={() => handlePageChange(currentPage + 1)}
                                // disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </>
            {/* )} */}
        </div>
    );
};

export { ProductList };
