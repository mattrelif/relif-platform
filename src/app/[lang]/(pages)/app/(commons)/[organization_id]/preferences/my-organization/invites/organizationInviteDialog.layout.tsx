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
import { ReactNode } from "react";

const OrganizationInviteDialog = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const { toast } = useToast();

    const handleInvite = (): void => {
        toast({
            title: "Accepted!",
            description: "Invitation accepted successfully.",
            variant: "success",
        });

        // toast({
        //     title: "Invalid entered data",
        //     description:
        //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        //     variant: "destructive",
        // });
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
                            Prefeitura do Rio de Janeiro
                        </span>
                        <span className="text-xs text-slate-500">123.456.789/1000-12</span>
                        <span className="text-xs text-slate-500">
                            <strong>By:</strong> anthony.vii27@gmail.com
                        </span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleInvite}>Accept</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { OrganizationInviteDialog };
