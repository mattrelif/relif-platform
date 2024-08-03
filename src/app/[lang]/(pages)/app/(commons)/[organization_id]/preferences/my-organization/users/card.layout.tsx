"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserSchema } from "@/types/user.types";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { UserEdit } from "./edit.layout";
import { UserRemove } from "./remove.layout";

type Props = UserSchema & {
    currentUserId: string;
    refreshList: () => void;
};

const UserCard = ({ currentUserId, refreshList, ...data }: Props): ReactNode => {
    const [editUserSheetOpenState, setEditUserSheetOpenState] = useState(false);
    const [removeUserDialogOpenState, setRemoveUserDialogOpenState] = useState(false);

    const initials = data.first_name.charAt(0).concat(data.last_name.charAt(0));
    const phonesLength = data.phones.length;

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        {initials || "US"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {data.first_name} {data.last_name}
                    </span>
                    <span className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                        <MdMail />
                        {data.email}
                    </span>
                    <HoverCard>
                        <HoverCardTrigger>
                            <span className="text-xs text-slate-500 flex items-center gap-2">
                                <MdPhone />
                                {data.phones[0] && data.phones[0].split("_").join(" ")}
                                {phonesLength >= 2 && (
                                    <Badge variant="outline">+{phonesLength - 1}</Badge>
                                )}
                            </span>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <h3 className="text-slate-900 font-bold text-sm mb-2">Phones</h3>
                            <ul>
                                {data.phones.map(phone => (
                                    <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                        <MdPhone /> {phone.split("_").join(" ")}
                                    </li>
                                ))}
                            </ul>
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </div>

            <div className="flex flex-col">
                <span className="text-xs text-slate-500">{data?.role || "Colaborator"}</span>
                <span>
                    <Badge>{data.platform_role || "MEMBER"}</Badge>
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
                        {/* <DropdownMenuItem onClick={() => setUserActivitiesSheetOpenState(true)}>
                            View activities
                        </DropdownMenuItem> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => setEditUserSheetOpenState(true)}>
                            <span className="flex items-center gap-2">
                                <FaEdit className="text-xs" />
                                Edit
                            </span>
                        </DropdownMenuItem>
                        {currentUserId !== data.id && (
                            <DropdownMenuItem onClick={() => setRemoveUserDialogOpenState(true)}>
                                <span className="flex items-center gap-2">
                                    <FaTrash className="text-xs" />
                                    Remove
                                </span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* <UserActivities
                userActivitiesSheetOpenState={userActivitiesSheetOpenState}
                setUserActivitiesSheetOpenState={setUserActivitiesSheetOpenState}
            /> */}

            <UserEdit
                user={data}
                refreshList={refreshList}
                editUserSheetOpenState={editUserSheetOpenState}
                setEditUserSheetOpenState={setEditUserSheetOpenState}
            />

            <UserRemove
                user={data}
                refreshList={refreshList}
                removeUserDialogOpenState={removeUserDialogOpenState}
                setRemoveUserDialogOpenState={setRemoveUserDialogOpenState}
            />
        </li>
    );
};

export { UserCard };
