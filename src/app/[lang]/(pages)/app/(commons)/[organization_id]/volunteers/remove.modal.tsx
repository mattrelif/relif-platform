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
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({ removeDialogOpenState, setRemoveDialogOpenState }: Props): ReactNode => {
    const { toast } = useToast();

    const handleDelete = (): void => {
        toast({
            title: "Removed!",
            description: "Beneficiary removed successfully.",
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
                            Anthony Vinicius Mota Silva
                        </span>
                        <span className="text-xs text-slate-500">anthony@example.com</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setRemoveDialogOpenState(false)}>
                            Cancel
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>Delete</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveModal };
