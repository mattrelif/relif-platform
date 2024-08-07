import { Locale } from "@/app/i18n-config";
import { ReactNode } from "react";

export default async function Page({
    params,
}: {
    params: {
        organization_id: string;
        lang: Locale;
    };
}): Promise<ReactNode> {
    return (
        <div>
            <h2>Organization {params.organization_id}</h2>
            Suppliers
            {params.lang}
        </div>
    );
}
