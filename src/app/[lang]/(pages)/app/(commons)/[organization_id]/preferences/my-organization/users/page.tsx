import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

import { AddUser } from "./add.layout";
import { UserList } from "./list.layout";

export default function Page(): ReactNode {
    return (
        <TabsContent value="users">
            <div className="w-full h-max pt-2 px-3 gap-4 flex items-center justify-between">
                <div />
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
