"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { FaBirthdayCake, FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { RemoveModal } from "./remove.modal";

const Card = (): ReactNode => {
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex gap-4">
                <Avatar className="w-14 h-14">
                    <AvatarImage src="https://github.com/anthonyvii27.png" />
                    <AvatarFallback className="bg-relif-orange-200 text-white">AV</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        Anthony Vinicius Mota Silva
                    </span>
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        Abrigo Santo Agostino (Since Mar 04, 2023)
                    </span>
                    <div></div>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <FaBirthdayCake /> Feb 27, 2000
                    </span>
                    <div className="flex mt-2 gap-2">
                        <span>
                            <Badge className="bg-yellow-300 text-slate-900">Underage</Badge>
                        </span>
                        <span>
                            <Badge className="bg-blue-600">Men</Badge>
                        </span>
                        <span>
                            <Badge className="bg-pink-500">Woman</Badge>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>View his/her housing</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <span className="flex items-center gap-2">
                                <FaEdit className="text-xs" />
                                Edit beneficiary
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove beneficiary
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="flex items-center gap-2">
                                <IoMdMove className="text-xs" />
                                Move to other housing
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        Created at Sep 14, 2022
                    </span>
                    <span>
                        <Badge>Active</Badge>
                    </span>
                </div>
            </div>

            <RemoveModal
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { Card };
