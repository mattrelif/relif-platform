import { Input } from "@/components/ui/input";
import { findOrganizationByID } from "@/repository/organization.repository";
import { ReactNode } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser, FaUsers } from "react-icons/fa6";
import { MdSearch } from "react-icons/md";
import { HousingList } from "./_housing/list.layout";
import { UserList } from "./_users/list.layout";
import { Toolbar } from "./toolbar.layout";

export default async function Page({
    params,
}: {
    params: {
        organization_id: string;
    };
}): Promise<ReactNode> {
    const { data } = await findOrganizationByID(params.organization_id);

    return (
        <div className="p-2 w-full h-max flex flex-col gap-2">
            <div className="w-full h-max p-4 rounded-lg border border-dashed border-relif-orange-200">
                <div className="flex flex-col w-full">
                    <Toolbar />
                    <h1 className="text-slate-900 font-bold text-2xl mt-6 pb-6 flex items-center gap-4">
                        <FaHouseChimneyUser />
                        {data?.name}
                    </h1>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {`${data?.address.street_name}, ${data?.address.street_number} - ${data?.address.city}, ${data?.address.district} | ${data?.address.zip_code} - ${data?.address.country}`}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        {/* TODO: FORMAT */}
                        Created at {data?.created_at}
                    </span>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
                    <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaUsers />
                        Users
                    </h3>
                    <div className="flex items-center gap-2">
                        <MdSearch className="text-slate-400 text-2xl" />
                        <Input type="text" placeholder="Search" className="w-full h-8" />
                    </div>
                    <UserList organizationId={params.organization_id} />
                </div>
                <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
                    <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaHouseChimneyUser />
                        Housings
                    </h3>
                    <div className="flex items-center gap-2">
                        <MdSearch className="text-slate-400 text-2xl" />
                        <Input type="text" placeholder="Search" className="w-full h-8" />
                    </div>
                    <HousingList organizationId={params.organization_id} />
                </div>
            </div>
        </div>
    );
}
