"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HousingSchema } from "@/types/housing.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { RemoveModal } from "./remove.modal";

type Props = HousingSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...data }: Props): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data?.name}</span>
                <span className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {`${data?.address.address_line_1}, ${data?.address.address_line_2} - ${data?.address.city}, ${data?.address.district} | ${data?.address.zip_code} - ${data?.address.country}`}
                </span>
                {/* <div className="flex flex-col gap-2 mt-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        346 beneficiaries (84% occupied)
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                        <span>
                            <Badge className="bg-green-500 text-slate-50 hover:bg-green-600">
                                Available (25 available spaces)
                            </Badge>
                        </span>
                        <span>
                            <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-950">
                                Full
                            </Badge>
                        </span>
                        <span>
                            <Badge className="bg-red-600 text-slate-50 hover:bg-red-700">
                                Over crowded
                            </Badge>
                        </span>
                    </span>
                </div> */}
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
                            <Link href={`${urlPath}/${data?.id}`}>View housing</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/${data?.id}/edit`}>
                                <span className="flex items-center gap-2">
                                    <FaEdit className="text-xs" />
                                    Edit housing
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove housing
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        {/* TODO: FORMAT */}
                        Created at {data.created_at}
                    </span>
                </div>
            </div>

            <RemoveModal
                housing={data}
                refreshList={refreshList}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
