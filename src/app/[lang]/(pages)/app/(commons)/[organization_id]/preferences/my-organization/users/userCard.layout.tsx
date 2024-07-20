"use client";

import { UserActivities } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/userActivities.layout";
import { UserEdit } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/userEdit.layout";
import { UserRemove } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/userRemove.layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

const UserCard = (): ReactNode => {
    const [userActivitiesSheetOpenState, setUserActivitiesSheetOpenState] = useState(false);
    const [editUserSheetOpenState, setEditUserSheetOpenState] = useState(false);
    const [removeUserDialogOpenState, setRemoveUserDialogOpenState] = useState(false);

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        AV
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">Anthony Vinicius</span>
                    <span className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                        <MdMail />
                        anthony.vii27@gmail.com
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                        <MdPhone />
                        +55 21 975869797 <Badge variant="outline">+2</Badge>
                    </span>
                </div>
            </div>

            <div className="flex flex-col">
                <span className="text-xs text-slate-500">Software Engineer</span>
                <span>
                    <Badge>ORG_ADMIN</Badge>
                </span>
            </div>

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setUserActivitiesSheetOpenState(true)}>
                            View activities
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditUserSheetOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaEdit className="text-xs" />
                                Edit
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRemoveUserDialogOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                Remove
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <UserActivities
                userActivitiesSheetOpenState={userActivitiesSheetOpenState}
                setUserActivitiesSheetOpenState={setUserActivitiesSheetOpenState}
            />

            <UserEdit
                editUserSheetOpenState={editUserSheetOpenState}
                setEditUserSheetOpenState={setEditUserSheetOpenState}
            />

            <UserRemove
                removeUserDialogOpenState={removeUserDialogOpenState}
                setRemoveUserDialogOpenState={setRemoveUserDialogOpenState}
            />
        </li>
    );
};

export { UserCard };
