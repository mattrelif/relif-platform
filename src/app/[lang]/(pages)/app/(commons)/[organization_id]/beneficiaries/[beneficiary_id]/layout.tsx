import { TabsLayout } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/[beneficiary_id]/tabs.layout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div>
            <div className="w-full h-max border-b-[1px] p-2">
                <TabsLayout />
            </div>
            <div className="h-[calc(100vh-140px)] overflow-x-hidden overflow-y-scroll">
                {children}
            </div>
        </div>
    );
}
