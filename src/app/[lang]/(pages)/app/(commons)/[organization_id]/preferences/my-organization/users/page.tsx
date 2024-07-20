import { UserCard } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/userCard.layout";
import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

export default function Page(): ReactNode {
    return (
        <TabsContent value="users">
            <ul className="w-full h-[calc(100vh-260px)] border-[1px] border-slate-200 rounded-md p-2 mt-4 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
            </ul>
        </TabsContent>
    );
}
