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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    moveDialogOpenState: boolean;
    setMoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const MoveModal = ({ moveDialogOpenState, setMoveDialogOpenState }: Props): ReactNode => {
    const { toast } = useToast();
    const [selectedHousing, setSelectedHousing] = useState("");

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
        <Dialog open={moveDialogOpenState} onOpenChange={setMoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the beneficiary
                        below.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            Anthony Vinicius Mota Silva
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>Current:</strong>Abrigo Santo Agostino (housed on QUARTO-02)
                        </span>
                    </div>
                    <div className="pt-4 flex flex-col gap-2">
                        <span className="text-xs text-slate-500 font-bold">To:</span>
                        <Select onValueChange={setSelectedHousing}>
                            <SelectTrigger className="w-full" id="housing">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="housing-1">Housing 1</SelectItem>
                                <SelectItem value="housing-2">Housing 2</SelectItem>
                                <SelectItem value="housing-3">Housing 3</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full" id="space">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedHousing === "housing-1" && (
                                    <>
                                        <SelectItem value="space-1">
                                            Space 1 [8 of 9 occupied]
                                        </SelectItem>
                                        <SelectItem value="space-2">
                                            Space 2 [7 of 5 occupied]
                                        </SelectItem>
                                        <SelectItem value="space-3">
                                            Space 3 [5 of 5 occupied]
                                        </SelectItem>
                                        <SelectItem value="space-4">
                                            Space 4 [0 of 5 occupied]
                                        </SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setMoveDialogOpenState(false)}>
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

export { MoveModal };
