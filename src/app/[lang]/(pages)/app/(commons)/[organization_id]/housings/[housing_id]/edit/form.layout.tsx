"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateHousing } from "@/repository/housing.repository";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { MdSave } from "react-icons/md";

type Props = {
    housingId: string;
};

const Form = ({ housingId }: Props): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                name: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
            } = Object.fromEntries(formData);

            const { data: responseData } = await updateHousing(housingId, {
                name: data.name,
                address: {
                    street_name: data.addressLine1,
                    street_number: data.addressLine2,
                    city: data.city,
                    zip_code: data.postalCode,
                    district: data.state,
                    country: data.country,
                },
            });

            const organizationId = responseData.organization_id;

            router.push(`/app/${organizationId}/housings/${housingId}`);
        } catch {
            setIsLoading(false);
            toast({
                title: "Housing Update Failed",
                description:
                    "An error occurred while attempting to update the housing. Please verify the input data and try again. If the problem persists, contact support for further assistance.",
                variant: "destructive",
            });
        }
    };

    return (
        <form className="w-full h-max flex flex-col gap-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                <FaHouseChimneyUser />
                Edit housing
            </h1>

            <div className="flex flex-col gap-3">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" type="text" defaultValue="" required />
            </div>

            <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <FaMapMarkerAlt /> Address
                </h2>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input id="addressLine1" name="addressLine1" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input id="addressLine2" name="addressLine2" type="text" required />
                </div>

                <div className="w-full flex items-center gap-2">
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" name="city" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="postalCode">Zip / Postal Code *</Label>
                        <Input id="postalCode" name="postalCode" type="text" required />
                    </div>
                </div>

                <div className="w-full flex items-center gap-2">
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="state">State / Province *</Label>
                        <Input id="state" name="state" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="country">Country *</Label>
                        <Input id="country" name="country" type="text" required />
                    </div>
                </div>
            </div>

            <Button className="flex items-center gap-2">
                <MdSave size={16} />
                {!isLoading ? "Edit housing" : "Loading..."}
            </Button>
        </form>
    );
};

export { Form };
