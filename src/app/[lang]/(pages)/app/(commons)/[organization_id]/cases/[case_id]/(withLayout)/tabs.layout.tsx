"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    
    // Detect if we're on updates tab (path ends with /updates)
    const isUpdatesTab = pathname.endsWith("/updates");
    const activeOption = isUpdatesTab ? "updates" : "overview";
    
    // Build the base case URL (remove /updates if present)
    const baseCaseUrl = isUpdatesTab ? pathname.replace("/updates", "") : pathname;

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
