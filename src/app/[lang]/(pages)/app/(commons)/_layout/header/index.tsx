"use client";

import { Breadcrumb } from "@/app/[lang]/(pages)/app/(commons)/_layout/header/components/breadcrumb.layout";
import { UserDropdown } from "@/app/[lang]/(pages)/app/(commons)/_layout/header/components/userDropdown.layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { HiMiniBellAlert } from "react-icons/hi2";
import { MdSettings } from "react-icons/md";

const Header = (): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    return (
        <header className="col-span-1 w-full h-max border-b-[1px] border-slate-200 flex items-center justify-between py-2 px-4">
            <Breadcrumb />

            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="icon" asChild className="w-7 h-7 p-0">
                                <Link href="#">
                                    <HiMiniBellAlert />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="icon" asChild className="w-7 h-7 p-0">
                                <Link href={`${urlPath}/preferences/platform`}>
                                    <MdSettings />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Preferences</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center justify-center pl-2">
                    <UserDropdown>
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/anthonyvii27.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </UserDropdown>
                </div>
            </div>
        </header>
    );
};

export { Header };
