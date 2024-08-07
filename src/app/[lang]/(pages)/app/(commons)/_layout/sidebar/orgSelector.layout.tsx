"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { findAllOrganizations } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";

const OrgSelector = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const [orgs, setOrgs] = useState<{ count: number; data: OrganizationSchema[] } | null>(null);
    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const organizationId = pathname.split("/")[3];

    useEffect(() => {
        (async () => {
            try {
                const user = await getFromLocalStorage("r_ud");
                console.log(user);
                if (user) {
                    setCurrentUser(user);
                    const OFFSET = 0;
                    const LIMIT = 9999;
                    // TODO: ALTERAR ENDPOINT P/ APENAS AQUELES QUE TEM ACESSO
                    const { data: organizations } = await findAllOrganizations(OFFSET, LIMIT);
                    setOrgs(organizations);
                } else {
                    throw new Error();
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const handleSetOrganization = (newOrgId: string) => {
        router.push(pathname.split("/").slice(0, 3).join("/").concat(`/${newOrgId}`));
    };

    if (currentUser && currentUser.organization_id && orgs && orgs.count > 0) {
        return (
            <Select defaultValue={organizationId} onValueChange={handleSetOrganization}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {orgs.data.map(org => (
                        <SelectItem value={org.id}>
                            <span className="flex items-center gap-2">
                                {org.name}
                                {currentUser?.organization_id === org.id ? (
                                    <FaCircle size={5} className="text-relif-orange-200" />
                                ) : undefined}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return <div />;
};

export { OrgSelector };
