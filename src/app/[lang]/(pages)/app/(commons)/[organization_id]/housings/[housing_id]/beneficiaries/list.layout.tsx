"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaUsers } from "react-icons/fa";
import { MdAdd, MdSearch } from "react-icons/md";
import { BeneficiaryCard } from "./card.layout";

const BeneficiaryList = (): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    return (
        <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
            <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <FaUsers />
                    Beneficiaries
                </h3>

                <div className="flex items-center gap-2">
                    <Select defaultValue="current">
                        <SelectTrigger className="w-[110px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="historic">Historic</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <Link href={`${urlPath}/beneficiaries/create`}>
                            <MdAdd size={16} /> New
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <MdSearch className="text-slate-400 text-2xl" />
                <Input type="text" placeholder="Search" className="w-full h-8" />
            </div>
            <div className="w-full h-[calc(100vh-459px)] border border-slate-200 rounded-md overflow-hidden">
                <div className="w-full h-full overflow-x-hidden overflow-y-scroll">
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="historic" />
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="historic" />
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="historic" />
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="current" />
                    <BeneficiaryCard type="current" />
                </div>
            </div>
            <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
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
            </div>
        </div>
    );
};

export { BeneficiaryList };
