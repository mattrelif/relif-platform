import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { MdSave } from "react-icons/md";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-[calc(100vh-260px)] p-4 border-[1px] border-slate-200 rounded-md overflow-x-hidden overflow-y-scroll mt-4">
            <form>
                <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-bold text-base text-relif-orange-200 mb-6">
                    Your organization
                </h2>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            disabled
                            defaultValue="Organization Test"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="description"
                            name="description"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="address-line-1">Address Line 1 *</Label>
                        <Input id="address-line-1" name="address-line-1" type="text" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="address-line-2">Address Line 2</Label>
                        <Input id="address-line-2" name="address-line-2" type="text" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" name="city" type="text" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" name="state" type="text" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="zipcode">Zip / Postal Code</Label>
                            <Input id="zipcode" name="zipcode" type="text" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" type="text" />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="default"
                    className="mt-[43px] w-full flex items-center gap-1"
                >
                    <MdSave size={14} />
                    Save
                </Button>
            </form>
        </div>
    );
}
