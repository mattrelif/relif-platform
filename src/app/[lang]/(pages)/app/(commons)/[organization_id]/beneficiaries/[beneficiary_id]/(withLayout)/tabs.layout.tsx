"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = (): ReactNode => {
    const pathname = usePathname();
    const activeOption = pathname.split("/")[6] ?? "overview";
    const urlPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <Tabs defaultValue={activeOption} className="w-full">
            <TabsList>
                <TabsTrigger value="overview" asChild>
                    <Link href={`${urlPath}`}>Overview</Link>
                </TabsTrigger>
                <TabsTrigger value="assistance" asChild>
                    <Link href={`${urlPath}/assistance`}>Assistance</Link>
                </TabsTrigger>
                <TabsTrigger value="movements" asChild>
                    <Link href={`${urlPath}/movements`}>Movements</Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export { TabsLayout };
