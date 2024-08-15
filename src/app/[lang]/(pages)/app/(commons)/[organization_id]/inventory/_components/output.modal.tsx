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
import { donateProductToBeneficiary } from "@/repository/beneficiary.repository";
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
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

const OutputProductModal = ({
    product,
    refreshList,
    modalOpenState,
    setModalOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiarySchema[] | []>([]);
    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currUser: UserSchema = await getFromLocalStorage("r_ud");
                setCurrentUser(currUser);

                if (currUser && currUser.organization_id) {
                    const { data: beneficiariesResponse } = await getBeneficiariesByOrganizationID(
                        currUser.organization_id,
                        0,
                        99999,
                        ""
                    );

                    setBeneficiaries(beneficiariesResponse.data);
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

    const handleDonate = async (): Promise<void> => {
        try {
            if (!selectedBeneficiary || !selectedStorage || !quantity) {
                throw new Error();
            }

            const storageFrom = selectedStorage.split("_");

            await donateProductToBeneficiary(product.id, {
                from: {
                    type: storageFrom[0] as "ORGANIZATION" | "HOUSING",
                    id: storageFrom[1],
                },
                product_type_id: product.id,
                quantity,
            });

            refreshList();

            setModalOpenState(false);
            toast({
                title: "Donation Successful",
                description: `You have successfully donated ${quantity} units of ${product.name} to the selected beneficiary.`,
                variant: "success",
            });
        } catch {
            toast({
                title: "Donation Failed",
                description: "An error occurred while processing your donation. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        Donate a product to a beneficiary
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        Select location where it is, the quantity and who you want to send it to.
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

                    {currentUser && currentUser.organization_id && beneficiaries && (
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
                                        {product && (
                                            <SelectContent>
                                                {product?.storage_records?.map((storage: any) => (
                                                    <SelectItem value={storage.id} key={storage.id}>
                                                        {storage.id === currentUser?.organization_id
                                                            ? "Organization Storage"
                                                            : storage.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        )}
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
                                        defaultValue={0}
                                        required
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        Select the beneficiary
                                    </Label>
                                    <Select onValueChange={setSelectedBeneficiary}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {beneficiaries?.map(beneficiary => (
                                                <SelectItem
                                                    value={beneficiary.id}
                                                    key={beneficiary.id}
                                                >
                                                    ({beneficiary.documents[0].type} -{" "}
                                                    {beneficiary.documents[0].value}){" "}
                                                    {beneficiary.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-5">
                                <Button variant="outline" onClick={() => setModalOpenState(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDonate}>Donate</Button>
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { OutputProductModal };
