import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

import { AddUser } from "./add.layout";
import { UserList } from "./list.layout";

export default async function Page({
    params,
}: {
    params: {
        organization_id: string;
        lang: Locale;
    };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <TabsContent value="users">
            <div className="w-full h-max pt-2 px-3 gap-4 flex items-center justify-between">
                <div />
                <AddUser>
                    <Button className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.commons.preferences.myOrganization.users.page.addUser}
                    </Button>
                </AddUser>
            </div>
            <UserList />
        </TabsContent>
    );
}
