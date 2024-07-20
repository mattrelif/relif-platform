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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

const AddUser = ({ children }: { children: Readonly<ReactNode> }): ReactNode => (
    <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="pb-3">Invite a new user</DialogTitle>
                <DialogDescription>
                    Enter the email of the user you want to add to your organization.
                </DialogDescription>
                <div className="flex flex-col pt-4 gap-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. john.doe@example.com"
                    />
                </div>
                <div className="flex gap-4 pt-5">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Invite user</Button>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
);

export { AddUser };
