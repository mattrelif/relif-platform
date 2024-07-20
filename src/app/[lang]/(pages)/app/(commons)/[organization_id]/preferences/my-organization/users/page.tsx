import { UserCard } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/userCard.layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

export default function Page(): ReactNode {
    return (
        <TabsContent value="users">
            <div className="w-full h-max pt-2 flex gap-4">
                <Input placeholder="Search user by name..." />
                <Button className="flex items-center gap-2">
                    <MdAdd size={16} />
                    Add user
                </Button>
            </div>
            <ul className="w-full h-[calc(100vh-316px)] border-[1px] border-slate-200 rounded-md p-2 mt-4 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
                {/* <span className="text-sm text-slate-900 font-medium">No users found...</span> */}
                {/* <span className="text-sm text-red-600 font-medium flex items-center gap-1"> */}
                {/*    <MdError /> */}
                {/*    Something went wrong. Please try again later. */}
                {/* </span> */}
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
