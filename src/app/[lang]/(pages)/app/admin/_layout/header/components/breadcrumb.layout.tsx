"use client";

import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumb as UIBreadcrumb,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const LABELS = {
    app: "Home",
    housing: "Housing",
    beneficiaries: "Beneficiaries",
    volunteers: "Volunteers",
    inventory: "Inventory",
    preferences: "Preferences",
    platform: "Platform",
    "my-organization": "My Organization",
    "my-profile": "My Profile",
    support: "Support",
    users: "Users",
    overview: "Overview",
    invites: "Invites",
    others: "Others",
    housings: "Housings",
    assistance: "Assistance",
    movements: "Movements",
    create: "Create",
    edit: "Edit",
    entry: "Entrypoint",
    admin: "Relif",
    organizations: "Organizations",
    requests: "Requests",
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
                                    {LABELS[page as keyof typeof LABELS] ??
                                        page?.toString().slice(0, 5).concat("...")}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </div>
                ))}

                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {LABELS[currentPage as keyof typeof LABELS] ??
                            currentPage?.toString().slice(0, 5).concat("...")}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </UIBreadcrumb>
    );
};

export { Breadcrumb };
