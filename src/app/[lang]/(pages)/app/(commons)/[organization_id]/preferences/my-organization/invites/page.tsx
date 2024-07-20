import { OrganizationInvite } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/invites/organizationInvite.layout";
import { UserInvite } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/invites/userInvite.layout";
import { ReactNode } from "react";
import { FaUsers } from "react-icons/fa";
import { MdDataset } from "react-icons/md";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-[calc(100vh-260px)] border-[1px] border-slate-200 rounded-md mt-4 grid grid-cols-2 overflow-hidden">
            <div className="w-full h-full border-r-[1px] border-slate-200">
                <h3 className="text-sm bg-slate-50 font-bold text-slate-900 py-2 px-4 border-b-[1px] border-slate-200 flex items-center gap-2">
                    <FaUsers size={14} />
                    Users
                </h3>
                <ul className="w-full h-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    <UserInvite />
                </ul>
            </div>
            <div className="w-full h-full">
                <h3 className="text-sm bg-slate-50 font-bold text-slate-900 py-2 px-4 border-b-[1px] border-slate-200 flex items-center gap-2">
                    <MdDataset size={14} />
                    Data Access
                </h3>
                <ul className="w-full h-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    <OrganizationInvite />
                </ul>
            </div>
        </div>
    );
}
