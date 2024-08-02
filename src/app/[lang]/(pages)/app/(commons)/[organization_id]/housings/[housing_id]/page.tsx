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
import { getHousingById } from "@/repository/housing.repository";
import { ReactNode } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { FaBoxesPacking, FaHouseChimneyUser } from "react-icons/fa6";
import { MdSearch, MdSpaceDashboard } from "react-icons/md";
import { BeneficiaryList } from "./_beneficiaries/list.layout";
import { InventoryCard } from "./_inventory/inventoryCard.layout";
import { SpaceList } from "./_spaces/list.layout";
import { Toolbar } from "./toolbar.layout";

export default async function Page({
    params,
}: {
    params: {
        housing_id: string;
    };
}): Promise<ReactNode> {
    const { data: housingData } = await getHousingById(params.housing_id);

    return (
        <div className="p-2 w-full h-max flex flex-col gap-2">
            <div className="w-full h-max p-4 rounded-lg border border-dashed border-relif-orange-200">
                <div className="flex flex-col w-full">
                    <Toolbar housing={housingData} />
                    <h1 className="text-slate-900 font-bold text-2xl mt-6 pb-6 flex items-center gap-4">
                        <FaHouseChimneyUser />
                        {housingData.name}
                    </h1>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {/* TODO: Address */}
                        {`${housingData?.address.street_name}, ${housingData?.address.street_number} - ${housingData?.address.city}, ${housingData?.address.district} | ${housingData?.address.zip_code} - ${housingData?.address.country}`}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        {/* TODO: Format */}
                        Created at {housingData.created_at}
                    </span>
                </div>
            </div>

            <div className="w-full grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-2">
                    <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500 flex justify-between">
                        <div className="flex flex-col w-full">
                            <h2 className="text-white font-bold text-base">Overview</h2>
                            {/* TODO: Backend */}
                            <div className="mt-2 pt-2 border-t-[1px] border-relif-orange-400 w-full flex flex-col gap-1">
                                <span className="text-white text-sm flex items-center gap-2">
                                    <FaUsers /> 343 beneficiaries, 28 slots available
                                </span>
                                <span className="text-white text-sm flex items-center gap-2">
                                    <MdSpaceDashboard /> 343 of 371 spaces occupied
                                </span>
                            </div>
                        </div>
                    </div>

                    <SpaceList housingId={params.housing_id} />
                </div>

                <BeneficiaryList housingId={params.housing_id} />

                <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
                    <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                        <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaBoxesPacking />
                            Inventory
                        </h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            Manage
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdSearch className="text-slate-400 text-2xl" />
                        <Input type="text" placeholder="Search" className="w-full h-8" />
                    </div>
                    <div className="w-full h-[calc(100vh-459px)] border border-slate-200 rounded-md overflow-hidden">
                        <div className="w-full h-full overflow-x-hidden overflow-y-scroll">
                            <InventoryCard />
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
            </div>
        </div>
    );
}
