"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { allocateProduct } from "@/repository/inventory.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { ProductSchema } from "@/types/product.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

type Props = {
    product: ProductSchema;
    refreshList: () => void;
    modalOpenState: boolean;
    setModalOpenState: Dispatch<SetStateAction<boolean>>;
};

const InputProductModal = ({
    product,
    refreshList,
    modalOpenState,
    setModalOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [quantity, setQuantity] = useState<number>(0);
    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currUser: UserSchema = await getFromLocalStorage("r_ud");
                setCurrentUser(currUser);
                if (currUser && currUser.organization_id) {
                    const { data: housingResponse } = await findHousingsByOrganizationId(
                        currUser.organization_id,
                        0,
                        9999,
                        ""
                    );
                    setHousings(housingResponse.data);
                } else {
                    throw new Error();
                }
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleAdd = async (): Promise<void> => {
        try {
            if (!selectedStorage) {
                throw new Error();
            }

            const [storageType, storageId] = selectedStorage.split("_");

            await allocateProduct(product.id, {
                to: {
                    type: storageType as "ORGANIZATION" | "HOUSING",
                    id: storageId,
                },
                quantity,
            });

            refreshList();

            setModalOpenState(false);
            toast({
                title: "Product Added Successfully",
                description: `${quantity} units of ${product.name} have been successfully added to storage.`,
                variant: "success",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Error Adding Product",
                description:
                    "An error occurred while trying to add the product to storage. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        Add new product to inventory
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        Select the location where the product is present, the product and enter the
                        quantity
                    </DialogDescription>

                    {isLoading && (
                        <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                            Loading...
                        </h2>
                    )}

                    {error && (
                        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                            <MdError />
                            Error message
                        </span>
                    )}

                    {currentUser && currentUser.organization_id && housings && (
                        <>
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        Where's the product?
                                    </Label>
                                    <Select onValueChange={setSelectedStorage}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={`ORGANIZATION_${currentUser.organization_id}`}
                                            >
                                                Organization Storage
                                            </SelectItem>
                                            {housings?.map((housing: HousingSchema) => (
                                                <SelectItem
                                                    key={housing.id}
                                                    value={`HOUSING_${housing.id}`}
                                                >
                                                    {housing.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        min={0}
                                        required
                                        defaultValue={0}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-5">
                                <Button variant="outline" onClick={() => setModalOpenState(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAdd}>Save</Button>
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { InputProductModal };
