"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaBuilding, FaHome, FaUsers } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";

const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const Sidebar = (): ReactNode => {
    const pathname = usePathname();
    const activeOption = pathname.split("/")[4] ?? "home";

    return (
        <nav className="row-span-2 w-[250px] h-[calc(100vh-32px)] bg-slate-50 pr-4 flex flex-col gap-5">
            <div className="h-[49px] p-2">
                <Image
                    src="/images/logo-relif-black.svg"
                    alt="Logo Relif Black"
                    width={126}
                    height={41}
                />
            </div>

            <ul className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold text-sm pl-2 mb-2">Admin</span>
                <Link href={`/app/admin/home`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "home"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaHome size={15} />
                        Home
                    </li>
                </Link>

                <Link href={`/app/admin/organizations`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "organizations"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaBuilding size={15} />
                        Organizations
                    </li>
                </Link>

                <Link href={`/app/admin/requests`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "requests"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaUsers size={15} />
                        Requests
                    </li>
                </Link>
            </ul>

            <span className="w-full border-b-[1px] border-slate-200" />

            <ul className="flex flex-col gap-1">
                <Link href={`/app/admin/preferences`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "preferences"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <MdSettings size={15} />
                        Preferences
                    </li>
                </Link>
            </ul>
        </nav>
    );
};

export { Sidebar };
