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
import { deleteBeneficiary } from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    beneficiary,
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

            await deleteBeneficiary(beneficiary.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            toast({
                title: "Removed!",
                description: "Beneficiary removed successfully.",
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Beneficiary Removal Failed",
                description:
                    "An error occurred while attempting to remove the beneficiary. Please try again later or contact support if the issue persists.",
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
                        This action cannot be undone. This will permanently delete the beneficiary
                        below.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {beneficiary.full_name}
                        </span>
                        <span className="text-xs text-slate-500">
                            {/* TODO: NAME */}
                            {beneficiary?.current_housing_id}
                        </span>
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
