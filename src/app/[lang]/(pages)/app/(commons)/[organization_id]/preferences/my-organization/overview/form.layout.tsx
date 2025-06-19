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
import { ReactNode, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { MdError, MdSave } from "react-icons/md";
import { FaUpload, FaRegBuilding, FaEdit } from "react-icons/fa";
import Image from "next/image";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [orgData, setOrgData] = useState<OrganizationSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    
    // Form state for controlled components
    const [formData, setFormData] = useState({
        description: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        country: ""
    });

    // Store original data for cancel functionality
    const [originalData, setOriginalData] = useState({
        description: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        logo: null as string | null,
        areas: [] as string[]
    });

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

                    // Set form data
                    const initialFormData = {
                        description: response.data.description || "",
                        addressLine1: response.data.address?.address_line_1 || "",
                        addressLine2: response.data.address?.address_line_2 || "",
                        city: response.data.address?.city || "",
                        state: response.data.address?.district || "",
                        zipcode: response.data.address?.zip_code || "",
                        country: response.data.address?.country || ""
                    };
                    
                    setFormData(initialFormData);
                    
                    // Store original data for cancel functionality
                    setOriginalData({
                        ...initialFormData,
                        logo: response.data.logo || null,
                        areas: response.data.areas_of_work || []
                    });
                } else {
                    throw new Error("No organization ID found");
                }
            } catch (error) {
                console.error("Error loading organization data:", error);
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
        if (!isEditing) return;
        setSelectedAreas((prev: string[]) =>
            prev.includes(area) ? prev.filter((a: string) => a !== area) : [...prev, area]
        );
    };

    const handleInputChange = (field: string, value: string) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Reset all form data to original values
        setFormData({
            description: originalData.description,
            addressLine1: originalData.addressLine1,
            addressLine2: originalData.addressLine2,
            city: originalData.city,
            state: originalData.state,
            zipcode: originalData.zipcode,
            country: originalData.country
        });
        setLogoPreview(originalData.logo);
        setSelectedAreas(originalData.areas);
        setIsEditing(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!orgData) {
            toast({
                title: "Error",
                description: "Organization data not loaded",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {
            await updateOrganization(orgData.id, {
                description: formData.description,
                name: orgData.name,
                logo: logoPreview || undefined,
                areas_of_work: selectedAreas.length > 0 ? selectedAreas : undefined,
                address: {
                    address_line_1: formData.addressLine1,
                    address_line_2: formData.addressLine2,
                    city: formData.city,
                    district: formData.state,
                    zip_code: formData.zipcode,
                    country: formData.country,
                },
            });

            // Update original data with new saved values
            setOriginalData({
                description: formData.description,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                zipcode: formData.zipcode,
                country: formData.country,
                logo: logoPreview,
                areas: selectedAreas
            });

            setIsEditing(false);

            toast({
                title: dict.commons.preferences.myOrganization.overview.toast.saved,
                description: dict.commons.preferences.myOrganization.overview.toast.savedDescription,
                variant: "success",
            });
        } catch (error) {
            console.error("Error saving organization:", error);
            toast({
                title: dict.commons.preferences.myOrganization.overview.toast.invalidEnteredData,
                description: dict.commons.preferences.myOrganization.overview.toast.invalidEnteredDataDescription,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-relif-orange-200 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-relif-orange-400 font-medium">
                        {dict.commons.preferences.myOrganization.overview.loading}
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <MdError size={20} />
                    {dict.commons.preferences.myOrganization.overview.error}
                </span>
            </div>
        );
    }

    if (!orgData) {
        return (
            <div className="flex items-center justify-center p-8">
                <span className="text-sm text-slate-500 font-medium">
                    No organization data available
                </span>
            </div>
        );
    }

    const canEdit = platformRole === "ORG_ADMIN";

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-bold text-base text-relif-orange-200">
                    {dict.commons.preferences.myOrganization.overview.yourOrganization}
                </h2>
                
                {canEdit && !isEditing && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                    >
                        <FaEdit size={14} />
                        Edit
                    </Button>
                )}
            </div>

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
                        value={orgData.name}
                        className="bg-slate-50 text-slate-700"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="description">
                        {dict.commons.preferences.myOrganization.overview.description}
                    </Label>
                    <textarea
                        className={
                            !isEditing 
                                ? "flex min-h-32 resize-none w-full rounded-md border border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-50 text-slate-700"
                                : "flex min-h-32 resize-none w-full rounded-md border border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white text-slate-900"
                        }
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        readOnly={!isEditing}
                        placeholder={!isEditing ? "" : "Enter organization description..."}
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
                        {canEdit && isEditing && (
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
                        {dict.createOrganization?.areasOfOperationList?.map(
                            (area: string) => {
                                const isSelected = selectedAreas.includes(area);
                                const isClickable = isEditing && canEdit;
                                
                                let buttonClasses = "px-3 py-1 mb-1 rounded-full border text-sm transition font-medium ";
                                
                                if (isSelected) {
                                    buttonClasses += "bg-relif-orange-200 text-white border-relif-orange-200 shadow ";
                                } else {
                                    buttonClasses += "bg-white text-relif-orange-200 border-relif-orange-200 ";
                                }
                                
                                if (isClickable) {
                                    buttonClasses += "cursor-pointer hover:bg-relif-orange-100 ";
                                } else {
                                    buttonClasses += "cursor-default opacity-75 ";
                                }
                                
                                return (
                                    <button
                                        key={area}
                                        type="button"
                                        disabled={!isEditing}
                                        className={buttonClasses}
                                        onClick={() => handleAreaToggle(area)}
                                        aria-pressed={isSelected}
                                    >
                                        {area}
                                    </button>
                                );
                            }
                        ) || (
                            <p className="text-sm text-slate-500">
                                Areas of work are not available. Please check your configuration.
                            </p>
                        )}
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
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                        placeholder={!isEditing ? "" : "Enter address line 1..."}
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
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                        placeholder={!isEditing ? "" : "Enter address line 2 (optional)..."}
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
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                            placeholder={!isEditing ? "" : "Enter city..."}
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
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                            placeholder={!isEditing ? "" : "Enter state/province..."}
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
                            value={formData.zipcode}
                            onChange={(e) => handleInputChange("zipcode", e.target.value)}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                            placeholder={!isEditing ? "" : "Enter zip/postal code..."}
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
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-slate-50 text-slate-700" : ""}
                            placeholder={!isEditing ? "" : "Enter country..."}
                        />
                    </div>
                </div>
            </div>

            {canEdit && isEditing && (
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isSaving}
                        className="flex items-center gap-1"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <MdSave size={14} />
                                {dict.commons.preferences.myOrganization.overview.save}
                            </>
                        )}
                    </Button>
                </div>
            )}
        </form>
    );
};

export { Form };
