"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { acceptRequest } from "@/repository/joinOrganizationRequests.repository";
import { JoinOrganizationRequestSchema } from "@/types/requests.types";
import { ReactNode } from "react";

type Props = {
    request: JoinOrganizationRequestSchema;
    refreshList: () => void;
    children: Readonly<ReactNode>;
};

const UserInviteDialogLayout = ({ request, refreshList, children }: Props): ReactNode => {
    const { toast } = useToast();

    const handleAccept = async () => {
        try {
            await acceptRequest(request.id);
            refreshList();
            toast({
                title: "Request Accepted!",
                description: "You have successfully accepted the request.",
            });
        } catch {
            toast({
                title: "Request Failed!",
                description: "There was an error processing your request. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Accept request</DialogTitle>
                    <DialogDescription>
                        Confirming the request to accept the entry of the user below into your
                        organization.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.user.first_name} {request.user.last_name}
                        </span>
                        <span className="text-xs text-slate-500">{request.user.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleAccept}>Accept</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserInviteDialogLayout };
