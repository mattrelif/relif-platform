"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { findOrganizationByID, updateOrganization } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError, MdSave } from "react-icons/md";

const Form = (): ReactNode => {
    const { toast } = useToast();

    const [orgData, setOrgData] = useState<OrganizationSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");

                if (currentUser.organization_id) {
                    const response = await findOrganizationByID(currentUser.organization_id);
                    setOrgData(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                description: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                state: string;
                zipcode: string;
                country: string;
            } = Object.fromEntries(formData);

            if (orgData) {
                await updateOrganization(orgData.id, {
                    description: data.description,
                    name: orgData.name,
                    address: {
                        address_line_1: data.addressLine1,
                        address_line_2: data.addressLine2,
                        city: data.city,
                        district: data.state,
                        zip_code: data.zipcode,
                        country: data.country,
                    },
                });

                toast({
                    title: "Saved!",
                    description: "The new data was saved successfully.",
                    variant: "success",
                });
            } else {
                throw new Error();
            }
        } catch {
            toast({
                title: "Invalid entered data",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {isLoading && <h2 className="p-2 text-relif-orange-400 font-medium">Loading...</h2>}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!error && !isLoading && orgData && (
                <form onSubmit={handleSubmit}>
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
                                required
                                defaultValue={orgData?.name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="description"
                                name="description"
                                defaultValue={orgData?.description}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine1">Address Line 1 *</Label>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                required
                                defaultValue={orgData?.address.address_line_1}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                required
                                defaultValue={orgData?.address.address_line_2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.city}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="state">State / Province</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.district}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="zipcode">Zip / Postal Code</Label>
                                <Input
                                    id="zipcode"
                                    name="zipcode"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.zip_code}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.country}
                                />
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
            )}
        </>
    );
};

export { Form };
