"use client";

import { Button } from "@/components/ui/button";
import { findUpdateOrganizationTypeRequestsByOrganizationId } from "@/repository/organization.repository";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { UserSchema } from "@/types/user.types";
import { formatDate } from "@/utils/formatDate";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { CoordinationRequestDialog } from "./coordinationRequestDialog.layout";
import { CoordinationRequestHistoric } from "./coordinationRequestHistoric.layout";
import OrganizationToken from "./organizationToken.layout";
import RequestDataAccess from "./requestDataAccess.layout";

export default function Page(): ReactNode {
    const pathname = usePathname();

    const [data, setData] = useState<{
        count: number;
        data: UpdateOrganizationTypeRequestSchema[];
    } | null>(null);
    const [isCoordination, setIsCoordination] =
        useState<UpdateOrganizationTypeRequestSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sheetOpenState, setSheetOpenState] = useState(false);

    const locale = pathname.split("/")[1] as "es" | "en" | "pt";

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");

                const OFFSET = 0;
                const LIMIT = 9999;
                const { data: orgTypeRequests } =
                    await findUpdateOrganizationTypeRequestsByOrganizationId(
                        currentUser.organization_id as string,
                        OFFSET,
                        LIMIT
                    );
                setData(orgTypeRequests);

                if (data && data.count > 0) {
                    setIsCoordination(data.data.find(item => item.status === "ACCEPTED") || null);
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) return <h2 className="p-4 text-relif-orange-400 font-medium">Loading...</h2>;

    if (error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                Something went wrong. Please try again later.
            </span>
        );

    if (data) {
        return (
            <div className="flex flex-col gap-4 w-full h-[calc(100vh-260px)] mt-4">
                {!isCoordination ? (
                    <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                        <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                            I want to be a coordinating organization
                        </h2>
                        <p className="text-sm text-slate-900 mb-5">
                            A coordinating organization can access data from other organizations,
                            such as lists of beneficiaries, shelters, and similar information.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <CoordinationRequestDialog>
                                <Button>Request to be a coordinating organization</Button>
                            </CoordinationRequestDialog>
                            <Button variant="outline" onClick={() => setSheetOpenState(true)}>
                                View historic
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                            <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                                You're already a coordinating organization
                            </h2>
                            <p className="text-sm text-slate-900 mb-5">
                                A coordinating organization can access data from other
                                organizations, such as lists of beneficiaries, shelters, and similar
                                information.
                            </p>
                            <span className="block text-sm text-slate-500">
                                Appeal accepted in{" "}
                                {formatDate(isCoordination?.accepted_at, locale || "en")}
                            </span>
                            <span className="text-xs text-slate-500 mb-5">
                                Requested by {isCoordination?.creator?.first_name} (
                                {isCoordination?.creator?.email}) on{" "}
                                {formatDate(isCoordination?.created_at, locale || "en")}
                            </span>
                        </div>

                        <RequestDataAccess />
                    </>
                )}

                <OrganizationToken />
                <CoordinationRequestHistoric
                    requests={data}
                    sheetOpenState={sheetOpenState}
                    setSheetOpenState={setSheetOpenState}
                />
            </div>
        );
    }

    return <div />;
}
