import { UserInviteDialogLayout } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/invites/userInviteDialog.layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { MdCheck, MdClose } from "react-icons/md";

const UserInvite = (): ReactNode => (
    <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
        <div className="flex gap-4">
            <Avatar>
                <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                    AV
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">Anthony Vinicius</span>
                <span className="text-xs text-slate-500">anthony.vii27@gmail.com</span>
                <span className="text-xs text-slate-400 mt-2">7 days ago</span>
            </div>
        </div>

        <div className="flex items-start gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <UserInviteDialogLayout>
                            <Button className="w-7 h-7 p-0 flex items-center justify-center">
                                <MdCheck />
                            </Button>
                        </UserInviteDialogLayout>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Accept invitation</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="outline"
                            className="w-7 h-7 p-0 flex items-center justify-center"
                        >
                            <MdClose />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reject invitation</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </li>
);

export { UserInvite };
