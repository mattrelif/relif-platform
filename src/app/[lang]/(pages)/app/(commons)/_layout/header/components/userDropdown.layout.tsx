"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const UserDropdown = ({ children }: { children: ReactNode }): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Hi, Anthony</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`${urlPath}/preferences/my-profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Preferences</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>
                            <Link href={`${urlPath}/preferences/my-organization/users`}>Team</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`${urlPath}/preferences/my-organization/overview`}>
                                Organization
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`${urlPath}/preferences/platform`}>Platform</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`${urlPath}/preferences/support`}>Support</Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="#">Logout</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { UserDropdown };
