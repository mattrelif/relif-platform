import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { FaMapMarkerAlt, FaRegBuilding } from "react-icons/fa";

const CreateOrganization = (): ReactNode => {
    return (
        <div className="w-[700px] h-max border border-slate-200 rounded-lg overflow-hidden">
            <h1 className="text-white bg-relif-orange-200 font-bold text-xl flex items-center justify-center w-full border-b-[1px] border-slate-200 p-6 gap-2">
                <FaRegBuilding /> Create Organization
            </h1>
            <div className="overflow-hidden flex flex-col gap-6 p-6 pl-8 overflow-x-hidden overflow-y-scroll">
                <div className="flex flex-col pt-4 gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="text" />
                </div>
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-md">
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
                <Button>Create</Button>
            </div>
        </div>
    );
};

export { CreateOrganization };
