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
import { ReactNode } from "react";

const OrganizationInviteDialog = ({ children }: { children: Readonly<ReactNode> }): ReactNode => (
    <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Accept data access request</DialogTitle>
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
                    <Button>Accept</Button>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
);

export { OrganizationInviteDialog };
