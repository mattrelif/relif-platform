import { TabsLayout as Tabs } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/tabs.layout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return <Tabs>{children}</Tabs>;
}
