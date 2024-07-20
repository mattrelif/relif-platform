"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const pathname = usePathname();
    const activeOption = pathname.split("/")[6] ?? "platform";
    const urlPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <Tabs defaultValue={activeOption} className="w-full">
            <TabsList>
                <TabsTrigger value="overview" asChild>
                    <Link href={`${urlPath}/overview`}>Overview</Link>
                </TabsTrigger>
                <TabsTrigger value="users" asChild>
                    <Link href={`${urlPath}/users`}>Users</Link>
                </TabsTrigger>
                <TabsTrigger value="invites" asChild>
                    <Link href={`${urlPath}/invites`}>Invites</Link>
                </TabsTrigger>
                <TabsTrigger value="others" asChild>
                    <Link href={`${urlPath}/others`}>Others</Link>
                </TabsTrigger>
            </TabsList>
            {children}
        </Tabs>
    );
};

export { TabsLayout };
