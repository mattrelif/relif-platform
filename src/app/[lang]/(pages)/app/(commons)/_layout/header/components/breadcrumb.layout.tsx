"use client";

import {
    Breadcrumb as UIBreadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const LABELS = {
    app: "Home",
    housing: "Housing",
    beneficiaries: "Beneficiaries",
    volunteers: "Volunteers",
    suppliers: "Suppliers",
    preferences: "Preferences",
    platform: "Platform",
    "my-organization": "My Organization",
    "my-profile": "My Profile",
    support: "Support",
};

const Breadcrumb = (): ReactNode => {
    const pathname = usePathname();
    const splittedPathname = pathname.split("/");

    const pages = splittedPathname.slice(2);
    const currentPage = pages.pop();

    const getHref = (page: string): string => {
        if (page === "app") return `${splittedPathname.slice(0, 4).join("/")}`;

        const index = splittedPathname.indexOf(page);
        if (index === -1) {
            return `${splittedPathname.join("/")}`;
        }

        return `${splittedPathname.slice(0, index + 1).join("/")}`;
    };

    return (
        <UIBreadcrumb>
            <BreadcrumbList>
                {pages?.map(page => (
                    <div key={page} className="flex items-center gap-3">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={getHref(page)}>
                                    {LABELS[page as keyof typeof LABELS] ?? page}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </div>
                ))}

                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {LABELS[currentPage as keyof typeof LABELS] ?? currentPage}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </UIBreadcrumb>
    );
};

export { Breadcrumb };
