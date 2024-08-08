"use client";

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
import { AiFillProduct } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";

type Props = {
    id?: string;
    storageName: string;
    products: number;
    items: number;
};

const Card = ({ id, storageName, products, items }: Props): ReactNode => {
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{storageName}</span>
                <span className="text-xs text-slate-500 font-regular mt-2 flex items-center gap-2">
                    <AiFillProduct />
                    {products} products, {items} items
                </span>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/housings/${id}`}>View housing</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { Card };
