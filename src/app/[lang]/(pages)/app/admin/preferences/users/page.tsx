import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";
import { AddUser } from "./add.layout";
import { UserList } from "./list.layout";

export default function Page(): ReactNode {
    return (
        <>
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
        </>
    );
}
