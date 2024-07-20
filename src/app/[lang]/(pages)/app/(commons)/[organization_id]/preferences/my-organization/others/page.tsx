import { CoordinationRequestDialog } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/others/coordinationRequestDialog.layout";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default function Page(): ReactNode {
    return (
        <div className="flex flex-col gap-4 w-full h-[calc(100vh-260px)] mt-4">
            <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                    I want to be a coordinating organization
                </h2>
                <p className="text-sm text-slate-900 mb-5">
                    A coordinating organization can access data from other organizations, such as
                    lists of beneficiaries, shelters, and similar information.
                </p>
                <CoordinationRequestDialog>
                    <Button>Request to be a coordinating organization</Button>
                </CoordinationRequestDialog>
            </div>
            <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                    You're already a coordinating organization
                </h2>
                <p className="text-sm text-slate-900 mb-5">
                    A coordinating organization can access data from other organizations, such as
                    lists of beneficiaries, shelters, and similar information.
                </p>
                <span className="block text-sm text-slate-500">
                    Appeal accepted in February 24, 2024
                </span>
                <span className="text-xs text-slate-500 mb-5">
                    Requested by Anthony (anthony.vii27@gmail.com) on February 13, 2024
                </span>
            </div>
        </div>
    );
}
