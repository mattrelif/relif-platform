"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getVoluntariesByOrganizationID } from "@/repository/volunteer.repository";
import { UserSchema } from "@/types/user.types";
import { VoluntarySchema } from "@/types/voluntary.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { Card } from "./card.layout";

const VolunteersList = (): ReactNode => {
    const [volunteers, setVolunteers] = useState<{
        count: number;
        data: VoluntarySchema[];
    } | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 20;

    const getVoluntaryList = async () => {
        try {
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (currentUser.organization_id) {
                const response = await getVoluntariesByOrganizationID(
                    currentUser.organization_id,
                    offset,
                    LIMIT
                );
                setVolunteers(response.data);
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
        getVoluntaryList();
    }, [offset]);

    const totalPages = volunteers ? Math.ceil(volunteers.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    return (
        <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
            {isLoading && (
                <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!isLoading && !error && volunteers && volunteers.data.length <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-4">
                    No beneficiaries found...
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
                                        href="#"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        // disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href="#"
                                            onClick={() => handlePageChange(index + 1)}
                                            isActive={index + 1 === currentPage}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        // disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
};

export { VolunteersList };
