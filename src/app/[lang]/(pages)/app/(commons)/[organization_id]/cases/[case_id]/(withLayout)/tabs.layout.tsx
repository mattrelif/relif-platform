"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const pathSegments = pathname.split("/");
    const activeOption = pathSegments[7] ?? "overview";
    
    // Build the base case URL (up to case_id)
    const baseCaseUrl = pathSegments.slice(0, 7).join("/");

    return (
        <Tabs value={activeOption} className="w-full">
            <TabsList>
                <TabsTrigger value="overview" asChild>
                    <Link href={baseCaseUrl}>
                        Overview
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="updates" asChild>
                    <Link href={`${baseCaseUrl}/updates`}>
                        Updates
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export { TabsLayout };
