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
import { acceptRequest } from "@/repository/organizationDataAccessRequests";
import { OrganizationDataAccessRequestSchema } from "@/types/organization.types";
import { ReactNode } from "react";

type Props = {
    request: OrganizationDataAccessRequestSchema;
    refreshList: () => void;
    children: Readonly<ReactNode>;
};

const OrganizationInviteDialog = ({ request, refreshList, children }: Props): ReactNode => {
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
                    <DialogTitle className="pb-3">Accept data access request</DialogTitle>
                    <DialogDescription>
                        Confirming the request to grant the organization below access to your
                        organization's data.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.requester_organization.name}
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>Requester: </strong>
                            {request.requester.first_name} {request.requester.last_name}
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>By:</strong> {request.requester.email}
                        </span>
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

export { OrganizationInviteDialog };
