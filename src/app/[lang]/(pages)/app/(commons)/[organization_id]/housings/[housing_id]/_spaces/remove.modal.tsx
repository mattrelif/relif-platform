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
import { deleteSpace, getBeneficiariesBySpaceId } from "@/repository/spaces.repository";
import { SpaceSchema } from "@/types/space.types";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    space: SpaceSchema;
    refreshList: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveSpaceModal = ({
    space,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");
    const OFFSET = 0;
    const LIMIT = 9999;

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getBeneficiariesBySpaceId(space.id, OFFSET, LIMIT);
                const beneficiaries = data.data;

                if (beneficiaries.length > 0) {
                    setAllowToRemove("UNAVAILABLE");
                } else {
                    setAllowToRemove("AVAILABLE");
                }
            } catch {
                setAllowToRemove("ERROR");
            }
        })();
    }, []);

    const handleDelete = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await deleteSpace(space.id);
            refreshList();

            toast({
                title: "Removed!",
                description: "Space removed successfully.",
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Space Removal Failed",
                description:
                    "An error occurred while attempting to remove the space. Please try again later or contact support if the issue persists.",
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
                        This action cannot be undone. This will permanently delete the space below.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">{space.name}</span>
                        {/* TODO: Format */}
                        <span className="text-xs text-slate-500">
                            Created at {space?.created_at}
                        </span>
                    </div>

                    {allowToRemove === "LOADING" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-blue-500">
                                Loading data: Please wait while we retrieve the information. This
                                may take a moment.
                            </span>
                            <Button disabled>Loading...</Button>
                        </div>
                    )}

                    {allowToRemove === "AVAILABLE" && (
                        <div className="flex gap-4 pt-5">
                            <Button
                                variant="outline"
                                onClick={() => setRemoveDialogOpenState(false)}
                            >
                                Cancel
                            </Button>
                            <DialogClose asChild>
                                <Button onClick={handleDelete}>
                                    {!isLoading ? "Delete" : "Loading..."}
                                </Button>
                            </DialogClose>
                        </div>
                    )}

                    {allowToRemove === "UNAVAILABLE" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-red-500">
                                You have beneficiaries associated with this space. Move or remove
                                them before removing this housing.
                            </span>
                            <Button onClick={() => setRemoveDialogOpenState(false)}>Close</Button>
                        </div>
                    )}

                    {allowToRemove === "ERROR" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-red-500">
                                Error: Unable to complete the action. Please try again later or
                                contact support if the issue persists.
                            </span>
                            <Button onClick={() => setRemoveDialogOpenState(false)}>Close</Button>
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveSpaceModal };
