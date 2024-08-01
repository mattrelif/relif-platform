"use client";

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
import { ReactNode } from "react";
import { MdSearch } from "react-icons/md";
import { Card } from "./_components/card.layout";
import { Toolbar } from "./_components/toolbar.layout";

export default function Page(): ReactNode {
    // const [housings, setHousings] = useState<HousingSchema[] | []>([]);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //           const response = await findHousingsByOrganizationId("");
    //         } catch(err) {

    //         }
    //     })()
    // }, [])

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-end gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <MdSearch className="text-slate-400 text-2xl" />
                    <Input type="text" placeholder="Search" className="w-[300px]" />
                </div>

                <Toolbar />
            </div>
            <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    <Card />
                </ul>

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
        </div>
    );
}
