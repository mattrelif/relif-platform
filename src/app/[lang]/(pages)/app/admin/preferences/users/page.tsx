import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

import { AddUser } from "./add.layout";
import { UserList } from "./list.layout";

export default async function Page({ params }: { params: { lang: Locale } }): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <>
            <div className="w-full h-max pt-2 pr-3 flex justify-end">
                <AddUser>
                    <Button className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.admin.preferences.users.page.addUser}
                    </Button>
                </AddUser>
            </div>
            <UserList />
        </>
    );
}
