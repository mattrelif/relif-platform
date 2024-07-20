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

const UserInviteDialogLayout = ({ children }: { children: Readonly<ReactNode> }): ReactNode => (
    <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Accept request</DialogTitle>
                <DialogDescription>
                    Confirming the request to accept the entry of the user below into your
                    organization.
                </DialogDescription>
                <div className="flex flex-col pt-4">
                    <span className="text-sm text-slate-900 font-bold">Anthony Vinicius</span>
                    <span className="text-xs text-slate-500">anthony.vii27@gmail.com</span>
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

export { UserInviteDialogLayout };
