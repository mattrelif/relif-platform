import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { MdSave } from "react-icons/md";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-max p-4 grid grid-cols-2 gap-4">
            <div className="w-full h-max flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaHouseChimneyUser />
                    Edit housing
                </h1>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="fullName">Name *</Label>
                    <Input id="fullName" name="fullName" type="text" defaultValue="" />
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaMapMarkerAlt /> Address
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" name="addressLine1" type="text" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input id="addressLine2" name="addressLine2" type="text" />
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" type="text" />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="postalCode">Zip / Postal Code</Label>
                            <Input id="postalCode" name="postalCode" type="text" />
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" name="state" type="text" />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" type="text" />
                        </div>
                    </div>
                </div>

                <Button className="flex items-center gap-2">
                    <MdSave size={16} />
                    Edit housing
                </Button>
            </div>
        </div>
    );
}
