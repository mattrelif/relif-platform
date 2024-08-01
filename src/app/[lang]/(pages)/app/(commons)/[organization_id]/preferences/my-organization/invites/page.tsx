import { ReactNode } from "react";
import { FaUsers } from "react-icons/fa";
import { MdDataset } from "react-icons/md";
import { OrganizationInviteList } from "./organizationInviteList.layout";
import { UserInviteList } from "./userInviteList.layout";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-[calc(100vh-260px)] border-[1px] border-slate-200 rounded-md mt-4 grid grid-cols-2 overflow-hidden">
            <div className="w-full h-full border-r-[1px] border-slate-200">
                <h3 className="text-sm bg-slate-50 font-bold text-slate-900 py-2 px-4 border-b-[1px] border-slate-200 flex items-center gap-2">
                    <FaUsers size={14} />
                    Users
                </h3>
                <UserInviteList />
            </div>
            <div className="w-full h-full">
                <h3 className="text-sm bg-slate-50 font-bold text-slate-900 py-2 px-4 border-b-[1px] border-slate-200 flex items-center gap-2">
                    <MdDataset size={14} />
                    Data Access
                </h3>
                <OrganizationInviteList />
            </div>
        </div>
    );
}
