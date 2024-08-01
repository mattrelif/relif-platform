import { AddUser } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/addUser.layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";
import { UserList } from "./userList.layout";

export default function Page(): ReactNode {
    return (
        <TabsContent value="users">
            <div className="w-full h-max pt-2 flex gap-4">
                <Input placeholder="Search user by name..." />
                <AddUser>
                    <Button className="flex items-center gap-2">
                        <MdAdd size={16} />
                        Add user
                    </Button>
                </AddUser>
            </div>
            <UserList />
        </TabsContent>
    );
}
