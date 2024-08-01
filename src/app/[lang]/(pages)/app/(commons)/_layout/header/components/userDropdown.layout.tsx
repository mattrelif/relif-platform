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
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/repository/auth.repository";
import { removeFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const UserDropdown = ({ children }: { children: ReactNode }): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    const urlPath = pathname.split("/").slice(0, 4).join("/");

    const onHandleSignOut = async (): Promise<void> => {
        try {
            await signOut();
            removeFromLocalStorage("r_ud");
            router.push("/", { scroll: false });
        } catch {
            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

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
                <DropdownMenuItem onClick={onHandleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { UserDropdown };
