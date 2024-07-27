"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SlOptions } from "react-icons/sl";

const BeneficiaryCard = (): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const userID = 123456;

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/anthonyvii27.png" />
                    <AvatarFallback className="bg-relif-orange-200 text-white">AV</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        Anthony Vinicius Mota Silva
                    </span>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        Since Feb 27, 2000
                    </span>
                </div>
            </div>
            <div className="flex items-start">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${userID}`}>View profile</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { BeneficiaryCard };
