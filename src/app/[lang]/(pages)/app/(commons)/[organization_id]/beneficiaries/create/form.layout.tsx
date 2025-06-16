"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateProfileImageUploadLink } from "@/repository/beneficiary.repository";
import { createBeneficiary } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState, useEffect } from "react";
import { FaUsers, FaMapMarkerAlt, FaUpload, FaUser } from "react-icons/fa";
import { MdContacts } from "react-icons/md";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Creatable from "react-select/creatable";
import { ActionMeta, OnChangeValue, MultiValue } from "react-select";

// Components
import { CivilStatus } from "./civilStatus.layout";
import { Education } from "./education.layout";
import { Gender } from "./gender.layout";
import { Medical } from "./medical.layout";
import { RelationshipDegree } from "./relationship.layout";

interface LanguageOption {
    value: string;
    label: string;
}

const Form = (): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const dict = useDictionary();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [languages, setLanguages] = useState<LanguageOption[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>("");
    const [emergencyPhone, setEmergencyPhone] = useState<string>("");
    const [skipMedicalInfo, setSkipMedicalInfo] = useState<boolean>(false);

    useEffect(() => {
        try {
            const user: UserSchema = getFromLocalStorage("r_ud");
            setCurrentUser(user);
        } catch (err) {
            console.error("Error loading current user:", err);
        }
    }, []);

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);

            // Upload to S3
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
            toast({
                title: "Upload Failed",
                description: "There was an error uploading the image.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleLanguageChange = (
        newValue: OnChangeValue<LanguageOption, true>,
        actionMeta: ActionMeta<LanguageOption>
    ) => {
        setLanguages([...(newValue || [])]);
    };

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                fullName: string;
                birthdate: string;
                documentType: string;
                documentValue: string;
                email: string;
                gender: string;
                civilStatus: string;
                education: string;
                occupation: string;
                languages: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
                emergencyName: string;
                emergencyRelationship: string;
                otherEmergencyRelationship: string;
                emergencyEmail: string;
                otherGender: string;
                otherCivilStatus: string;
                otherEducation: string;
                // Medical fields
                allergies: string;
                currentMedications: string;
                chronicMedicalConditions: string;
                healthInsurance: string;
                bloodType: string;
                vaccinations: string;
                mentalHealth: string;
                height: string;
                weight: string;
                addictions: string;
                disabilities: string;
                prothesisOrMedicalDevices: string;
            } = Object.fromEntries(formData);

            // Validate required fields
            if (!data.fullName || !data.birthdate || !data.email) {
                throw new Error("Missing required fields: fullName, birthdate, or email");
            }

            // Validate document fields
            if (!data.documentType || !data.documentValue) {
                throw new Error("Document type and document value are required");
            }

            // Validate other required fields
            if (!data.occupation) {
                throw new Error("Occupation is required");
            }

            if (!phone || phone.trim() === "") {
                throw new Error("Phone number is required");
            }

            if (!languages || languages.length === 0) {
                throw new Error("At least one language is required");
            }

            // Validate address fields
            if (!data.addressLine1 || !data.city || !data.postalCode || !data.state || !data.country) {
                throw new Error("Address fields (address line 1, city, postal code, state, country) are required");
            }

            // Validate emergency contact fields
            if (!data.emergencyName) {
                throw new Error("Emergency contact name is required");
            }

            if (!emergencyPhone || emergencyPhone.trim() === "") {
                throw new Error("Emergency contact phone is required");
            }

            if (!data.emergencyEmail) {
                throw new Error("Emergency contact email is required");
            }

            // Validate "other" options
            if (data.gender === "other" && (!data.otherGender || data.otherGender.trim() === "")) {
                throw new Error("Please specify the gender when 'Other' is selected");
            }

            if (data.civilStatus === "other" && (!data.otherCivilStatus || data.otherCivilStatus.trim() === "")) {
                throw new Error("Please specify the civil status when 'Other' is selected");
            }

            if (data.education === "other" && (!data.otherEducation || data.otherEducation.trim() === "")) {
                throw new Error("Please specify the education when 'Other' is selected");
            }

            // Validate emergency contact relationship
            const relationship = data.emergencyRelationship === "other" ? data.otherEmergencyRelationship : data.emergencyRelationship;
            if (!relationship || relationship.trim() === "") {
                throw new Error("Emergency contact relationship is required");
            }

            const today = new Date();
            const birthdate = new Date(data.birthdate);
            if (birthdate >= today) {
                throw new Error("Birthdate must be in the past");
            }

            if (!currentUser?.organization_id) {
                throw new Error("Organization ID is required");
            }

            const medicalData = skipMedicalInfo ? {
                allergies: [],
                current_medications: [],
                recurrent_medical_conditions: [],
                health_insurance_plans: [],
                blood_type: "",
                taken_vaccines: [],
                mental_health_history: [],
                height: 0,
                weight: 0,
                addictions: [],
                disabilities: [],
                prothesis_or_medical_devices: [],
            } : {
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
            };

            await createBeneficiary(currentUser.organization_id, {
                full_name: data.fullName,
                image_url: imageUrl || "",
                birthdate: data.birthdate,
                email: data.email,
                gender: data.gender === "other" ? data.otherGender : data.gender,
                civil_status: data.civilStatus === "other" ? data.otherCivilStatus : data.civilStatus,
                education: data.education === "other" ? data.otherEducation : data.education,
                occupation: data.occupation,
                spoken_languages: languages.map(lang => lang.value),
                phones: phone ? [phone] : [],
                address: {
                    address_line_1: data.addressLine1 || "",
                    address_line_2: data.addressLine2 || "",
                    city: data.city || "",
                    district: data.state || "",
                    zip_code: data.postalCode || "",
                    country: data.country || "",
                },
                medical_information: medicalData,
                notes: "",
                documents: [
                    {
                        type: data.documentType,
                        value: data.documentValue,
                    },
                ],
                emergency_contacts: [
                    {
                        full_name: data.emergencyName,
                        relationship: relationship,
                        phones: emergencyPhone ? [emergencyPhone] : [],
                        emails: [data.emergencyEmail],
                    },
                ],
            });

            toast({
                title: dict.commons.beneficiaries.create.toastSuccessTitle,
                description: dict.commons.beneficiaries.create.toastSuccessDescription,
            });

            router.push(urlPath);
        } catch (err: any) {
            console.error("Beneficiary creation error:", err);
            console.error("Error details:", {
                message: err instanceof Error ? err.message : "Unknown error",
                response: err?.response?.data,
                status: err?.response?.status,
                organizationId: currentUser?.organization_id,
            });

            toast({
                title: dict.commons.beneficiaries.create.toastErrorTitle,
                description: `${dict.commons.beneficiaries.create.toastErrorDescription} ${err instanceof Error ? err.message : ""}`,
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

                {/* Profile Image Section with styled border */}
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaUser /> Profile Picture
                    </h2>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-relif-orange-200 bg-slate-50 flex items-center justify-center">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <FaUser size={32} className="text-slate-300" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="picture"
                                className="cursor-pointer flex items-center gap-2 text-sm text-relif-orange-200 hover:underline"
                            >
                                <FaUpload size={12} />
                                Upload Picture
                            </Label>
                            <Input 
                                id="picture" 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload} 
                            />
                            {isUploading && <p className="text-sm text-slate-500">Uploading...</p>}
                        </div>
                    </div>
                </div>

                {/* Basic Information Section */}
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaUser /> Basic Information
                    </h2>

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
                            <Select name="documentType" required>
                                <SelectTrigger className="w-[50%]">
                                    <SelectValue placeholder="Document Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="national_id">National ID</SelectItem>
                                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                                    <SelectItem value="cpf">CPF</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <PhoneInput
                            country={"us"}
                            value={phone}
                            onChange={(value: string) => setPhone(value)}
                            containerClass="w-full"
                            inputStyle={{
                                height: "40px",
                                width: "100%",
                                borderColor: "#e2e8f0",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                            }}
                            buttonStyle={{
                                borderColor: "#e2e8f0",
                                borderRadius: "0.375rem 0 0 0.375rem",
                            }}
                            inputProps={{
                                name: "phone",
                                required: true,
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="languages">
                            {dict.commons.beneficiaries.create.languages} *
                        </Label>
                        <Creatable
                            isMulti
                            value={languages}
                            onChange={handleLanguageChange}
                            placeholder="Select or create languages..."
                            options={[
                                { value: "english", label: "English" },
                                { value: "spanish", label: "Spanish" },
                                { value: "portuguese", label: "Portuguese" },
                                { value: "french", label: "French" },
                                { value: "arabic", label: "Arabic" },
                                { value: "mandarin", label: "Mandarin" },
                                { value: "hindi", label: "Hindi" },
                                { value: "russian", label: "Russian" },
                                { value: "german", label: "German" },
                                { value: "italian", label: "Italian" },
                            ]}
                            styles={{
                                control: base => ({
                                    ...base,
                                    borderColor: "#e2e8f0",
                                    fontSize: "0.875rem",
                                    minHeight: "40px",
                                }),
                                placeholder: base => ({
                                    ...base,
                                    color: "#94a3b8",
                                    fontSize: "0.875rem",
                                }),
                                multiValue: base => ({
                                    ...base,
                                    backgroundColor: "#f1f5f9",
                                    borderRadius: "0.375rem",
                                }),
                                multiValueLabel: base => ({
                                    ...base,
                                    fontSize: "0.875rem",
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full h-max flex flex-col gap-6">
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
                        <PhoneInput
                            country={"us"}
                            value={emergencyPhone}
                            onChange={(value: string) => setEmergencyPhone(value)}
                            containerClass="w-full"
                            inputStyle={{
                                height: "40px",
                                width: "100%",
                                borderColor: "#e2e8f0",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                            }}
                            buttonStyle={{
                                borderColor: "#e2e8f0",
                                borderRadius: "0.375rem 0 0 0.375rem",
                            }}
                            inputProps={{
                                name: "emergencyPhone",
                                required: true,
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="emergencyEmail">
                            {dict.commons.beneficiaries.create.emergencyEmail} *
                        </Label>
                        <Input id="emergencyEmail" name="emergencyEmail" type="email" required />
                    </div>
                </div>

                {/* Medical Information Section with Skip Option */}
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <MdContacts /> Medical Information
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="skipMedical" 
                                checked={skipMedicalInfo}
                                onCheckedChange={(checked) => setSkipMedicalInfo(checked as boolean)}
                            />
                            <Label htmlFor="skipMedical" className="text-sm font-normal">
                                Skip medical information
                            </Label>
                        </div>
                    </div>

                    <div className={skipMedicalInfo ? "opacity-50 pointer-events-none" : ""}>
                        <Medical />
                    </div>
                </div>

                <div className="flex gap-4 pt-5">
                    <Button variant="outline" type="button" onClick={() => router.push(urlPath)}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Create Beneficiary
                    </Button>
                </div>
            </div>
        </form>
    );
};

export { Form };
