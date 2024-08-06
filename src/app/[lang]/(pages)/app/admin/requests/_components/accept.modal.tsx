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
import { useToast } from "@/components/ui/use-toast";
import { acceptRequest } from "@/repository/updateOrganizationTypeRequests";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FaUser } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

type Props = {
    request: UpdateOrganizationTypeRequestSchema;
    refreshList: () => void;
    acceptDialogOpenState: boolean;
    setAcceptDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const AcceptModal = ({
    request,
    refreshList,
    acceptDialogOpenState,
    setAcceptDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();

    const handleAccept = async (): Promise<void> => {
        try {
            await acceptRequest(request.id);

            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/requests");
            }

            toast({
                title: "Coordination Access Enabled",
                description:
                    "Organization's type has been successfully changed to coordination, with access to data from other organizations.",
            });
        } catch {
            toast({
                title: "Coordination Access Change Failed",
                description:
                    "An error occurred while attempting to change the organization's type to coordination. Please try again later or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={acceptDialogOpenState} onOpenChange={setAcceptDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Accept request</DialogTitle>
                    <DialogDescription>
                        Confirming the request to accept the change of the organization type below
                        from Management to Coordination, allowing access to data from other
                        organizations.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.organization.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2 mt-2">
                            <FaUser />
                            {request.creator.first_name} {request.creator.last_name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2">
                            <MdMail />
                            {request.creator.email}
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

export { AcceptModal };
