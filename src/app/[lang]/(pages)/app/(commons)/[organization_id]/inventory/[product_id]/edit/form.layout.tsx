"use client";

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
import { ReactNode } from "react";
import { FaBoxes } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Form = (): ReactNode => {
    return (
        <form className="w-full h-[calc(100vh-83px)] p-4 grid grid-cols-2 lg:flex lg:flex-col overflow-x-hidden overflow-y-scroll">
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaBoxes />
                    Edit a product
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
                    <Label htmlFor="productBrand">Brand *</Label>
                    <Input id="productBrand" name="productBrand" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="unitType">Unit type *</Label>
                    <Select defaultValue="name">
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
                            <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input id="otherUnit" name="otherUnit" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="segments">Segments *</Label>
                    <Select defaultValue="name">
                        <SelectTrigger className="w-full" id="segments">
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

                <Button className="flex items-center gap-2">
                    <MdAdd size={16} />
                    Create
                </Button>
            </div>
        </form>
    );
};

export { Form };
