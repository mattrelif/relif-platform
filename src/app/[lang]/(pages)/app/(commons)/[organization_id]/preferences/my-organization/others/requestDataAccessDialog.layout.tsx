"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createDataAccessRequest } from "@/repository/organization.repository";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    requestDialogOpenState: boolean;
    setRequestDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RequestDataAccessDialog = ({
    requestDialogOpenState,
    setRequestDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const [orgToken, setOrgToken] = useState("");

    const handleRequest = async () => {
        try {
            await createDataAccessRequest(orgToken);

            toast({
                title: "Request successful!",
                description: "Your data access request was completed successfully.",
                variant: "success",
            });

            setRequestDialogOpenState(false);
        } catch {
            toast({
                title: "Request failed",
                description: "Unable to complete the request at this time. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={requestDialogOpenState} onOpenChange={setRequestDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        Request Data from Another Organization
                    </DialogTitle>
                    <DialogDescription>
                        Please provide the token of the organization from which you wish to request
                        access. To obtain this token, contact a member of the organization and
                        request it.
                    </DialogDescription>
                    <div className="pt-4 pb-5">
                        <Input
                            type="text"
                            id="orgToken"
                            name="orgToken"
                            placeholder="Insert the organization token here"
                            required
                            onChange={e => setOrgToken(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleRequest}>Request</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RequestDataAccessDialog };
