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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    modalOpenState: boolean;
    setModalOpenState: Dispatch<SetStateAction<boolean>>;
};

const OutputProductModal = ({ modalOpenState, setModalOpenState }: Props): ReactNode => {
    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        Donate a product to a beneficiary
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        Select the product, the location where it is, the quantity and who you want
                        to send it to.
                    </DialogDescription>
                    <div className="flex flex-col gap-6 pt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="product" className="text-start">
                                Select the product
                            </Label>
                            <Select>
                                <SelectTrigger className="w-full" id="product">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="abc123">
                                        Pacote Fralda Pampers c/ 12 unidades
                                    </SelectItem>
                                    <SelectItem value="p2">Product 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="locale" className="text-start">
                                Where's the product?
                            </Label>
                            <Select defaultValue="name">
                                <SelectTrigger className="w-full" id="locale">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="organization">Organization</SelectItem>
                                    <SelectItem value="abbdjskahfla">
                                        Abrigo Santo Agostinho
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="locale" className="text-start">
                                Quantity
                            </Label>
                            <Input id="quantity" type="number" placeholder="Quantity" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="locale" className="text-start">
                                Select the beneficiary
                            </Label>
                            <Select defaultValue="name">
                                <SelectTrigger className="w-full" id="locale">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="organization">
                                        (173.456.123-87) Anthony Vinicius Mota Silva
                                    </SelectItem>
                                    <SelectItem value="abbdjskahfla">
                                        Abrigo Santo Agostinho
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setModalOpenState(false)}>
                            Cancel
                        </Button>
                        <DialogClose asChild>
                            <Button>Donate</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { OutputProductModal };
