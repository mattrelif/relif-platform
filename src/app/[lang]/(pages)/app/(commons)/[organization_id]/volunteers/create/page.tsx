import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { BirthdateInput } from "./birthdate.layout";
import { CivilStatus } from "./civilStatus.layout";
import { Education } from "./education.layout";
import { Gender } from "./gender.layout";
import { Languages } from "./languages.layout";
import { Medical } from "./medical.layout";
import { Phones } from "./phones.layout";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-max p-4 grid grid-cols-2 gap-4">
            <div className="w-full h-max flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaUsers />
                    Create voluntary
                </h1>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="fullName">Name *</Label>
                    <Input id="fullName" name="fullName" type="text" defaultValue="" />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="birthdate">Birthdate</Label>
                    <BirthdateInput />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" defaultValue="" />
                </div>

                <Gender />

                <CivilStatus />

                <Education />

                <div className="flex flex-col gap-3">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" name="occupation" type="text" />
                </div>

                <Phones />

                <Languages />

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
            </div>

            <div className="flex flex-col gap-6">
                <Medical />

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                        className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="notes"
                        name="notes"
                    />
                </div>

                <Button className="flex items-center gap-2">
                    <MdAdd size={16} />
                    Create volunteer
                </Button>
            </div>
        </div>
    );
}
