"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { findOrganizationByID, updateOrganization } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState, ChangeEvent } from "react";
import { MdError, MdSave } from "react-icons/md";
import { FaUpload, FaRegBuilding } from "react-icons/fa";
import Image from "next/image";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [orgData, setOrgData] = useState<OrganizationSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");
                if (currentUser.organization_id) {
                    const response = await findOrganizationByID(currentUser.organization_id);
                    setOrgData(response.data);
                    
                    // Set initial logo and areas
                    if (response.data.logo) {
                        setLogoPreview(response.data.logo);
                    }
                    if (response.data.areas_of_work) {
                        setSelectedAreas(response.data.areas_of_work);
                    }
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

    const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(orgData?.logo || null);
        }
    };

    const handleAreaToggle = (area: string) => {
        setSelectedAreas((prev: string[]) =>
            prev.includes(area)
                ? prev.filter((a: string) => a !== area)
                : [...prev, area]
        );
    };

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
                    logo: logoPreview || undefined,
                    areas_of_work: selectedAreas.length > 0 ? selectedAreas : undefined,
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
                    title: dict.commons.preferences.myOrganization.overview.toast.saved,
                    description:
                        dict.commons.preferences.myOrganization.overview.toast.savedDescription,
                    variant: "success",
                });
            } else {
                throw new Error();
            }
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.overview.toast.invalidEnteredData,
                description:
                    dict.commons.preferences.myOrganization.overview.toast
                        .invalidEnteredDataDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {isLoading && (
                <h2 className="p-2 text-relif-orange-400 font-medium">
                    {dict.commons.preferences.myOrganization.overview.loading}
                </h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <MdError />
                    {dict.commons.preferences.myOrganization.overview.error}
                </span>
            )}
            {!error && !isLoading && orgData && (
                <form onSubmit={handleSubmit}>
                    <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-bold text-base text-relif-orange-200 mb-6">
                        {dict.commons.preferences.myOrganization.overview.yourOrganization}
                    </h2>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">
                                {dict.commons.preferences.myOrganization.overview.name}
                            </Label>
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
                            <Label htmlFor="description">
                                {dict.commons.preferences.myOrganization.overview.description}
                            </Label>
                            <textarea
                                className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="description"
                                name="description"
                                defaultValue={orgData?.description}
                                readOnly={platformRole !== "ORG_ADMIN"}
                            />
                        </div>

                        {/* Logo Upload Section */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="logo">
                                {dict.commons.preferences.myOrganization.overview.logo}
                            </Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-relif-orange-200 bg-slate-50 flex items-center justify-center">
                                    {logoPreview ? (
                                        <Image
                                            src={logoPreview}
                                            alt="Organization Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <FaRegBuilding size={24} className="text-slate-300" />
                                    )}
                                </div>
                                {platformRole === "ORG_ADMIN" && (
                                    <div className="flex flex-col gap-2">
                                        <Label
                                            htmlFor="logo"
                                            className="cursor-pointer flex items-center gap-2 text-sm text-relif-orange-200 hover:underline"
                                        >
                                            <FaUpload size={12} />
                                            {dict.commons.preferences.myOrganization.overview.uploadLogo}
                                        </Label>
                                        <Input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Areas of Work Section */}
                        <div className="flex flex-col gap-3">
                            <Label>
                                {dict.commons.preferences.myOrganization.overview.areasOfWork}
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {dict.createOrganization.areasOfOperationList.map((area: string) => (
                                    <button
                                        key={area}
                                        type="button"
                                        disabled={platformRole !== "ORG_ADMIN"}
                                        className={`px-3 py-1 mb-1 rounded-full border text-sm transition font-medium ${
                                            selectedAreas.includes(area)
                                                ? "bg-relif-orange-200 text-white border-relif-orange-200 shadow"
                                                : "bg-white text-relif-orange-200 border-relif-orange-200 hover:bg-relif-orange-100"
                                        } ${
                                            platformRole !== "ORG_ADMIN" 
                                                ? "opacity-50 cursor-not-allowed" 
                                                : "cursor-pointer"
                                        }`}
                                        onClick={() => platformRole === "ORG_ADMIN" && handleAreaToggle(area)}
                                        aria-pressed={selectedAreas.includes(area)}
                                    >
                                        {area}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine1">
                                {dict.commons.preferences.myOrganization.overview.addressLine} 1 *
                            </Label>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                required
                                defaultValue={orgData?.address.address_line_1}
                                readOnly={platformRole !== "ORG_ADMIN"}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine2">
                                {dict.commons.preferences.myOrganization.overview.addressLine} 2
                            </Label>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                defaultValue={orgData?.address.address_line_2}
                                readOnly={platformRole !== "ORG_ADMIN"}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="city">
                                    {dict.commons.preferences.myOrganization.overview.city} *
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.city}
                                    readOnly={platformRole !== "ORG_ADMIN"}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="state">
                                    {dict.commons.preferences.myOrganization.overview.state}
                                </Label>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.district}
                                    readOnly={platformRole !== "ORG_ADMIN"}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="zipcode">
                                    {dict.commons.preferences.myOrganization.overview.zipcode}
                                </Label>
                                <Input
                                    id="zipcode"
                                    name="zipcode"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.zip_code}
                                    readOnly={platformRole !== "ORG_ADMIN"}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="country">
                                    {dict.commons.preferences.myOrganization.overview.country}
                                </Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    required
                                    defaultValue={orgData?.address.country}
                                    readOnly={platformRole !== "ORG_ADMIN"}
                                />
                            </div>
                        </div>
                    </div>

                    {platformRole === "ORG_ADMIN" && (
                        <Button
                            type="submit"
                            variant="default"
                            className="mt-[43px] w-full flex items-center gap-1"
                        >
                            <MdSave size={14} />
                            {dict.commons.preferences.myOrganization.overview.save}
                        </Button>
                    )}
                </form>
            )}
        </>
    );
};

export { Form };
