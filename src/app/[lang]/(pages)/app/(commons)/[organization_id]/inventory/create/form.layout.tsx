"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { createProduct } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBoxes } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { MdAdd } from "react-icons/md";

const Form = (): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (currentUser && currentUser.organization_id) {
                // @ts-ignore
                const data: {
                    name: string;
                    description: string;
                    brand: string;
                    unitType: string;
                    category: string;
                } = Object.fromEntries(formData);

                await createProduct(currentUser.organization_id, {
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    category: data.category,
                    unit_type: data.unitType,
                });

                toast({
                    title: "Product created successfully!",
                    description: `The product "${data.name}" has been added to the inventory.`,
                    variant: "success",
                });

                router.push(`/app/${currentUser.organization_id}/inventory`);
            } else {
                throw new Error();
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            toast({
                title: "Error creating product",
                description:
                    "An error occurred while trying to create the product. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <form
            className="w-full h-[calc(100vh-83px)] p-4 grid grid-cols-2 lg:flex lg:flex-col overflow-x-hidden overflow-y-scroll"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaBoxes />
                    Create a new product
                </h1>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" type="text" required />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="description"
                        name="description"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input id="brand" name="brand" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="unitType">Unit type *</Label>
                    <Select name="unitType" required>
                        <SelectTrigger className="w-full" id="unitType">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="un">UN</SelectItem>
                            <SelectItem value="kg">KG</SelectItem>
                            <SelectItem value="g">G</SelectItem>
                            <SelectItem value="dz">DZ</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" required>
                        <SelectTrigger className="w-full" id="category">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="foodAndBeverages">Food and Beverages</SelectItem>
                            <SelectItem value="personalCareAndBeauty">
                                Personal Care and Beauty
                            </SelectItem>
                            <SelectItem value="householdCleaning">Household Cleaning</SelectItem>
                            <SelectItem value="babyCareProducts">Baby Care Products</SelectItem>
                            <SelectItem value="petProducts">Pet Products</SelectItem>
                            <SelectItem value="pharmacyAndMedications">
                                Pharmacy and Medications
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Alert>
                    <IoMdAlert className="h-4 w-4" />
                    <AlertTitle>
                        Assign Quantities and Associate with Housings or Organization After Creation
                    </AlertTitle>
                    <AlertDescription className="text-slate-500">
                        You will be able to assign quantities and link them to specific housings or
                        organization once the creation process is complete.
                    </AlertDescription>
                </Alert>

                <Button className="flex items-center gap-2" type="submit">
                    <MdAdd size={16} />
                    {!isLoading ? "Create" : "Loading..."}
                </Button>
            </div>
        </form>
    );
};

export { Form };
