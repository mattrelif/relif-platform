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
import { deleteProduct, getProductById } from "@/repository/inventory.repository";
import { ProductSchema } from "@/types/product.types";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    product: ProductSchema;
    refreshList: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    product,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getProductById(product.id);

                if (data.storage_records.length > 0) {
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

            await deleteProduct(product.id);

            refreshList();

            setRemoveDialogOpenState(false);

            toast({
                title: "Product Deleted Successfully",
                description: `${product.name} has been removed from the inventory.`,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Error Deleting Product",
                description:
                    "An error occurred while trying to delete the product. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (product) {
        return (
            <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3 text-start">TITLE</DialogTitle>
                        <DialogDescription className="text-start">DESCRIPTION</DialogDescription>
                        <div className="flex flex-col pt-4">
                            <span className="text-sm text-slate-900 font-bold text-start">
                                {product?.name}
                            </span>
                            <span className="text-xs text-slate-500 text-start">
                                {product?.brand} - {product?.category}
                            </span>
                        </div>

                        {allowToRemove === "LOADING" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-blue-500">Loading...</span>
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
                                    {!isLoading ? "Remove" : "Loading..."}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "UNAVAILABLE" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">Unavailable message</span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    Close
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "ERROR" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">Error message</span>
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
