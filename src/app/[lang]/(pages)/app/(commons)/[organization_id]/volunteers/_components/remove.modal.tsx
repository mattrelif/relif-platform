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
import { deleteVolunteer } from "@/repository/volunteer.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    volunteer: VoluntarySchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    volunteer,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(false);
    const backToListPath = pathname.split("/").slice(0, 5).join("/");

    const handleDelete = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await deleteVolunteer(volunteer.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            toast({
                title: "Removed!",
                description: "Volunteer removed successfully.",
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Volunteer Removal Failed",
                description:
                    "An error occurred while attempting to remove the volunteer. Please try again later or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };
    return (
        <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the volunteer
                        below.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {convertToTitleCase(volunteer.full_name)}
                        </span>
                        <span className="text-xs text-slate-500">{volunteer.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setRemoveDialogOpenState(false)}>
                            Cancel
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>
                                {!isLoading ? "Delete" : "Loading..."}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveModal };
