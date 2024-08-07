"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteHousing, getBeneficiariesByHousingId } from "@/repository/housing.repository";
import { HousingSchema } from "@/types/housing.types";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    housing: HousingSchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    housing,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");
    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const OFFSET = 0;
    const LIMIT = 9999;

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getBeneficiariesByHousingId(housing.id, OFFSET, LIMIT);
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

            await deleteHousing(housing.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            setRemoveDialogOpenState(false);

            toast({
                title: "Removed!",
                description: "Housing removed successfully.",
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Housing Removal Failed",
                description:
                    "An error occurred while attempting to remove the housing. Please try again later or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    if (housing && housing.address) {
        return (
            <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3">Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the housing
                            below.
                        </DialogDescription>
                        <div className="flex flex-col pt-4">
                            <span className="text-sm text-slate-900 font-bold">
                                {housing?.name}
                            </span>
                            <span className="text-xs text-slate-500">
                                {`${housing?.address.address_line_1}, ${housing?.address.address_line_2} - ${housing?.address.city}, ${housing?.address.district} | ${housing?.address.zip_code} - ${housing?.address.country}`}
                            </span>
                        </div>

                        {allowToRemove === "LOADING" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-blue-500">
                                    Loading data: Please wait while we retrieve the information.
                                    This may take a moment.
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
                                <Button onClick={handleDelete}>
                                    {!isLoading ? "Delete" : "Loading..."}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "UNAVAILABLE" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">
                                    You have beneficiaries associated with this housing. Move or
                                    remove them before removing this housing.
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    Close
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "ERROR" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">
                                    Error: Unable to complete the action. Please try again later or
                                    contact support if the issue persists.
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    Close
                                </Button>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return <div />;
};

export { RemoveModal };
