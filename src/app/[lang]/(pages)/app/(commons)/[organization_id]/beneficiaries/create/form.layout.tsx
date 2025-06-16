"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateProfileImageUploadLink } from "@/repository/beneficiary.repository";
import { createBeneficiary } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdAdd, MdContacts } from "react-icons/md";

import { CivilStatus } from "./civilStatus.layout";
import { Education } from "./education.layout";
import { Gender } from "./gender.layout";
import { Medical } from "./medical.layout";
import { RelationshipDegree } from "./relationship.layout";

const Form = (): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const dict = useDictionary();

    const [languages, setLanguages] = useState<string[] | []>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const { data } = await generateProfileImageUploadLink(file.type);

            await fetch(data.link, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });

            const s3Link = data.link.split("?")[0];
            setImageUrl(s3Link);

            toast({
                title: "Upload Successful",
                description: "The image has been uploaded successfully.",
                variant: "success",
            });
        } catch (err) {
            setIsUploading(false);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading the image.",
                variant: "destructive",
            });
        }
    };

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                fullName: string;
                birthdate: string;
                email: string;
                gender: string;
                otherGender: string;
                civilStatus: string;
                otherCivilStatus: string;
                education: string;
                otherEducation: string;
                occupation: string;
                documentType: string;
                documentValue: string;
                countryCode: string;
                phone: string;
                languages: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
                allergies: string;
                currentMedications: string;
                chronicMedicalConditions: string;
                healthInsurance: string;
                bloodType: string;
                vaccinations: string;
                mentalHealth: string;
                height: number;
                weight: number;
                addictions: string;
                disabilities: string;
                prothesisOrMedicalDevices: string;
                notes: string;
                emergencyName: string;
                emergencyRelationship: string;
                otherEmergencyRelationship: string;
                emergencyCountryCode: string;
                emergencyPhone: string;
                emergencyEmail: string;
            } = Object.fromEntries(formData);

            // Validate required fields
            if (!data.fullName || !data.birthdate || !data.email) {
                throw new Error("Missing required fields: fullName, birthdate, or email");
            }

            const today = new Date();
            const birthdate = new Date(data.birthdate);
            if (birthdate >= today) {
                throw new Error("Birthdate must be in the past");
            }

            if (currentUser?.organization_id) {
                const { data: newBeneficiary } = await createBeneficiary(
                    currentUser.organization_id,
                    {
                        full_name: data.fullName,
                        image_url: imageUrl || "",
                        birthdate: data.birthdate,
                        email: data.email,
                        gender: data.gender === "other" ? data.otherGender : data.gender,
                        civil_status:
                            data.civilStatus === "other" ? data.otherCivilStatus : data.civilStatus,
                        education:
                            data.education === "other" ? data.otherEducation : data.education,
                        occupation: data.occupation,
                        spoken_languages: data.languages ? data.languages.split(",").filter(lang => lang.trim()) : [],
                        phones: [`${data.countryCode}_${data.phone}`],
                        address: {
                            address_line_1: data.addressLine1,
                            address_line_2: data.addressLine2,
                            city: data.city,
                            district: data.state,
                            zip_code: data.postalCode,
                            country: data.country,
                        },
                        medical_information: {
                            allergies: data.allergies ? data.allergies.split(",").filter(item => item.trim()) : [],
                            current_medications: data.currentMedications ? data.currentMedications.split(",").filter(item => item.trim()) : [],
                            recurrent_medical_conditions: data.chronicMedicalConditions ? data.chronicMedicalConditions.split(",").filter(item => item.trim()) : [],
                            health_insurance_plans: data.healthInsurance ? data.healthInsurance.split(",").filter(item => item.trim()) : [],
                            blood_type: data.bloodType || "",
                            taken_vaccines: data.vaccinations ? data.vaccinations.split(",").filter(item => item.trim()) : [],
                            mental_health_history: data.mentalHealth ? data.mentalHealth.split(",").filter(item => item.trim()) : [],
                            height: Number(data.height) || 0,
                            weight: Number(data.weight) || 0,
                            addictions: data.addictions ? data.addictions.split(",").filter(item => item.trim()) : [],
                            disabilities: data.disabilities ? data.disabilities.split(",").filter(item => item.trim()) : [],
                            prothesis_or_medical_devices: data.prothesisOrMedicalDevices ? data.prothesisOrMedicalDevices.split(",").filter(item => item.trim()) : [],
                        },
                        notes: data.notes,
                        documents: [
                            {
                                type: data.documentType,
                                value: data.documentValue,
                            },
                        ],
                        emergency_contacts: [
                            {
                                phones: [`${data.emergencyCountryCode}_${data.emergencyPhone}`],
                                emails: [data.emergencyEmail],
                                full_name: data.emergencyName,
                                relationship:
                                    data.emergencyRelationship === "other"
                                        ? data.otherEmergencyRelationship
                                        : data.emergencyRelationship,
                            },
                        ],
                    }
                );

                toast({
                    title: dict.commons.beneficiaries.create.toastSuccessTitle,
                    description: dict.commons.beneficiaries.create.toastSuccessDescription,
                    variant: "success",
                });

                router.push(`${urlPath}/create/${newBeneficiary.id}/allocate`);
            } else {
                throw new Error();
            }
        } catch (err: any) {
            console.error("Beneficiary creation error:", err);
            console.error("Error details:", {
                message: err instanceof Error ? err.message : 'Unknown error',
                response: err?.response?.data,
                status: err?.response?.status,
                organizationId: (await getFromLocalStorage("r_ud"))?.organization_id
            });
            
            toast({
                title: dict.commons.beneficiaries.create.toastErrorTitle,
                description: `${dict.commons.beneficiaries.create.toastErrorDescription} ${err instanceof Error ? err.message : ''}`,
                variant: "destructive",
            });
        }
    };

    return (
        <form
            className="w-full h-max p-4 grid grid-cols-2 gap-4 lg:flex lg:flex-col"
            onSubmit={handleSubmit}
        >
            <div className="w-full h-max flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaUsers />
                    {dict.commons.beneficiaries.create.title}
                </h1>

                <div className="flex flex-col gap-3 border border-slate-200 p-4 rounded-lg">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" onChange={handleImageUpload} />
                    {isUploading && <p>Uploading image...</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="fullName">{dict.commons.beneficiaries.create.fullName} *</Label>
                    <Input id="fullName" name="fullName" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="birthdate">
                        {dict.commons.beneficiaries.create.birthdate} *
                    </Label>
                    <input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        className="w-full px-3 py-2 border rounded-md text-sm text-slate-900 placeholder-slate-400 border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-relif-orange-200"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="document">{dict.commons.beneficiaries.create.document} *</Label>
                    <div className="w-full flex gap-2">
                        <Input
                            id="documentType"
                            name="documentType"
                            type="text"
                            placeholder={dict.commons.beneficiaries.create.documentTypePlaceholder}
                            className="w-[50%]"
                            required
                        />
                        <Input
                            id="documentValue"
                            name="documentValue"
                            type="text"
                            className="w-[50%]"
                            placeholder={dict.commons.beneficiaries.create.documentValuePlaceholder}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="email">{dict.commons.beneficiaries.create.email} *</Label>
                    <Input id="email" name="email" type="email" required />
                </div>

                <Gender />

                <CivilStatus />

                <Education />

                <div className="flex flex-col gap-3">
                    <Label htmlFor="occupation">
                        {dict.commons.beneficiaries.create.occupation} *
                    </Label>
                    <Input id="occupation" name="occupation" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="phone">{dict.commons.beneficiaries.create.phone} *</Label>
                    <div className="w-full flex gap-2">
                        <Input
                            id="countryCode"
                            name="countryCode"
                            type="text"
                            placeholder={dict.commons.beneficiaries.create.countryCodePlaceholder}
                            className="w-[30%]"
                            required
                        />
                        <Input id="phone" name="phone" type="text" required />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="languages">
                        {dict.commons.beneficiaries.create.languages} *
                    </Label>
                    <Input
                        id="languages"
                        name="languages"
                        type="text"
                        placeholder={dict.commons.beneficiaries.create.languagesPlaceholder}
                        onChange={handleInputChange(setLanguages)}
                        required
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {languages?.map((language, index) => (
                            <Badge variant="outline" key={index}>
                                {language}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaMapMarkerAlt /> {dict.commons.beneficiaries.create.lastAddress}
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine1">
                            {dict.commons.beneficiaries.create.addressLine} 1 *
                        </Label>
                        <Input id="addressLine1" name="addressLine1" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine2">
                            {dict.commons.beneficiaries.create.addressLine} 2
                        </Label>
                        <Input id="addressLine2" name="addressLine2" type="text" />
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="city">{dict.commons.beneficiaries.create.city} *</Label>
                            <Input id="city" name="city" type="text" required />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="postalCode">
                                {dict.commons.beneficiaries.create.postalCode} *
                            </Label>
                            <Input id="postalCode" name="postalCode" type="text" required />
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="state">
                                {dict.commons.beneficiaries.create.state} *
                            </Label>
                            <Input id="state" name="state" type="text" required />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="country">
                                {dict.commons.beneficiaries.create.country} *
                            </Label>
                            <Input id="country" name="country" type="text" required />
                        </div>
                    </div>
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <MdContacts /> {dict.commons.beneficiaries.create.emergencyContact}
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="emergencyName">
                            {dict.commons.beneficiaries.create.emergencyName} *
                        </Label>
                        <Input id="emergencyName" name="emergencyName" type="text" required />
                    </div>

                    <RelationshipDegree />

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="emergencyPhone">
                            {dict.commons.beneficiaries.create.emergencyPhone} *
                        </Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="emergencyCountryCode"
                                name="emergencyCountryCode"
                                type="text"
                                placeholder="e.g. +55"
                                className="w-[30%]"
                                required
                            />
                            <Input id="emergencyPhone" name="emergencyPhone" type="text" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="emergencyEmail">
                            {dict.commons.beneficiaries.create.emergencyEmail} *
                        </Label>
                        <Input id="emergencyEmail" name="emergencyEmail" type="text" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <Medical />

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="notes">{dict.commons.beneficiaries.create.notes}</Label>
                    <textarea
                        className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="notes"
                        name="notes"
                    />
                </div>

                <Button className="flex items-center gap-2">
                    <MdAdd size={16} />
                    {dict.commons.beneficiaries.create.createBeneficiaryButton}
                </Button>
            </div>
        </form>
    );
};

export { Form };
