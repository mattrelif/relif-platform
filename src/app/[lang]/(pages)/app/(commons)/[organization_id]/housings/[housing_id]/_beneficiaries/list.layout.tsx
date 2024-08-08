"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBeneficiariesByHousingId } from "@/repository/housing.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { MdAdd, MdError, MdSearch } from "react-icons/md";

import { BeneficiaryCard } from "./card.layout";

type Props = {
    housingId: string;
};

const BeneficiaryList = ({ housingId }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    // const [toggle, setToggle] = useState<"current" | "historic">("current");
    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const getCurrentBeneficiariesList = async () => {
        (async () => {
            try {
                const response = await getBeneficiariesByHousingId(housingId, OFFSET, LIMIT);
                setBeneficiaries(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    // const getHistoricBeneficiariesList = async () => {
    //     (async () => {
    //         try {
    //             const response = await getAllocationsByHousingId(housingId, OFFSET, LIMIT);
    //         } catch {
    //             setError(true);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     })();
    // };

    useEffect(() => {
        setIsLoading(true);

        // if (toggle === "current") {
        getCurrentBeneficiariesList();
        // } else {
        //     getHistoricBeneficiariesList();
        // }
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
            <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <FaUsers />
                    {dict.housingOverview.beneficiaryList.title}
                </h3>

                <div className="flex items-center gap-2">
                    {/* <Select
                        value={toggle}
                        onValueChange={(opt: "current" | "historic") => setToggle(opt)}
                    >
                        <SelectTrigger className="w-[110px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="historic">Historic</SelectItem>
                        </SelectContent>
                    </Select> */}

                    <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <Link href={`${urlPath}/beneficiaries/create`}>
                            <MdAdd size={16} /> {dict.housingOverview.beneficiaryList.btnNew}
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <MdSearch className="text-slate-400 text-2xl" />
                <Input type="text" placeholder="Search" className="w-full h-8" />
            </div>
            <div className="w-full h-[calc(100vh-394px)] border border-slate-200 rounded-md overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.housingOverview.beneficiaryList.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.housingOverview.beneficiaryList.error}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.data.length <= 0 && (
                    <span className="block text-sm text-slate-900 font-medium p-4">
                        {dict.housingOverview.beneficiaryList.notFound}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.data.length > 0 && (
                    <ul className="w-full h-full overflow-x-hidden overflow-y-scroll">
                        {beneficiaries?.data.map(beneficiary => (
                            <BeneficiaryCard {...beneficiary} />
                        ))}
                    </ul>
                )}
            </div>
            {/* <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div> */}
        </div>
    );
};

export { BeneficiaryList };
