import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { MdCheck, MdClose, MdInfo, MdPhone } from "react-icons/md";

const OrganizationInfoCard = ({ children }: { children: Readonly<ReactNode> }): ReactNode => (
    <HoverCard>
        <HoverCardTrigger>{children}</HoverCardTrigger>
        <HoverCardContent>
            <h3 className="text-sm text-slate-900 font-bold">Prefeitura do Rio de Janeiro</h3>
            <span className="text-xs text-slate-600 font-medium">123.456.789/1000-28</span>
            <span className="flex w-full pt-3 border-b-[1px] border-slate-200" />
            <h4 className="text-relif-orange-200 text-xs font-bold pt-3 pb-1 flex items-center gap-1">
                <MdPhone />
                Contact List
            </h4>
            <div className="w-full flex items-center justify-between">
                <span className="text-xs text-slate-500">anthony@example.com</span>
            </div>
            <div className="w-full flex items-center justify-between">
                <span className="text-xs text-slate-500">anthony@test.com</span>
            </div>
            <span className="flex text-xs text-slate-400 pt-1">+4 others</span>
            <Button variant="outline" size="sm" className="mt-3">
                Copy list of contacts
            </Button>
        </HoverCardContent>
    </HoverCard>
);

const OrganizationInvite = (): ReactNode => (
    <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
        <div className="flex gap-4">
            <OrganizationInfoCard>
                <div className="w-8 h-8 rounded-md bg-relif-orange-500 text-white text-xl flex items-center justify-center">
                    <MdInfo />
                </div>
            </OrganizationInfoCard>
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">
                    Prefeitura do Rio de Janeiro
                </span>
                <span className="text-xs text-slate-500">
                    <strong>By: </strong>anthony.vinicius@example.com
                </span>
                <span className="text-xs text-slate-400 mt-2">2 days ago</span>
            </div>
        </div>

        <div className="flex items-start gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button className="w-7 h-7 p-0 flex items-center justify-center">
                            <MdCheck />
                        </Button>
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

export { OrganizationInvite };
