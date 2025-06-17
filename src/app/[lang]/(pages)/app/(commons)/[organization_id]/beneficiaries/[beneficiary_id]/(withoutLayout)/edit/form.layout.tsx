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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    generateProfileImageUploadLink,
    getBeneficiaryById,
    updateBeneficiary,
} from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FaUsers, FaMapMarkerAlt, FaUpload, FaUser } from "react-icons/fa";
import { MdContacts, MdError, MdSave } from "react-icons/md";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Creatable from "react-select/creatable";
import { ActionMeta, OnChangeValue, MultiValue } from "react-select";

import { CivilStatus } from "./civilStatus.layout";
import { Education } from "./education.layout";
import { Gender } from "./gender.layout";
import { Medical } from "./medical.layout";
import { RelationshipDegree } from "./relationship.layout";

interface LanguageOption {
    value: string;
    label: string;
}

type Props = {
    beneficiaryId: string;
};

const Form = ({ beneficiaryId }: Props): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();
    const { toast } = useToast();

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const [data, setData] = useState<BeneficiarySchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [languages, setLanguages] = useState<LanguageOption[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>("");
    const [emergencyPhone, setEmergencyPhone] = useState<string>("");
    const [skipMedicalInfo, setSkipMedicalInfo] = useState<boolean>(false);
    const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (beneficiaryId) {
                    const response = await getBeneficiaryById(beneficiaryId);
                    const beneficiary = response.data;
                    setData(beneficiary);
                    
                    // Set initial values
                    if (beneficiary.image_url) {
                        setImageUrl(beneficiary.image_url);
                        setImagePreview(beneficiary.image_url);
                    }
                    
                    if (beneficiary.phones && beneficiary.phones.length > 0) {
                        setPhone(beneficiary.phones[0]);
                    }
                    
                    if (beneficiary.emergency_contacts && beneficiary.emergency_contacts.length > 0) {
                        const emergencyContact = beneficiary.emergency_contacts[0];
                        if (emergencyContact.phones && emergencyContact.phones.length > 0) {
                            setEmergencyPhone(emergencyContact.phones[0]);
                        }
                    }
                    
                    if (beneficiary.spoken_languages) {
                        setLanguages(beneficiary.spoken_languages.map(lang => ({ value: lang, label: lang })));
                    }
                    
                    if (beneficiary.birthdate) {
                        setBirthdate(new Date(beneficiary.birthdate));
                    }
                    
                    if (beneficiary.notes) {
                        setNotes(beneficiary.notes);
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
    }, [beneficiaryId]);

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

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const fData: {
                fullName: string;
                birthdate: string;
                documentType: string;
                documentValue: string;
                email: string;
                gender: string;
                civilStatus: string;
                education: string;
                occupation: string;
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

            // Validate emergency contact relationship
            const relationship = fData.emergencyRelationship === "other" ? fData.otherEmergencyRelationship : fData.emergencyRelationship;

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
                allergies: fData.allergies ? fData.allergies.split(",").map(item => item.trim()).filter(Boolean) : [],
                current_medications: fData.currentMedications ? fData.currentMedications.split(",").map(item => item.trim()).filter(Boolean) : [],
                recurrent_medical_conditions: fData.chronicMedicalConditions ? fData.chronicMedicalConditions.split(",").map(item => item.trim()).filter(Boolean) : [],
                health_insurance_plans: fData.healthInsurance ? fData.healthInsurance.split(",").map(item => item.trim()).filter(Boolean) : [],
                blood_type: fData.bloodType || "",
                taken_vaccines: fData.vaccinations ? fData.vaccinations.split(",").map(item => item.trim()).filter(Boolean) : [],
                mental_health_history: fData.mentalHealth ? fData.mentalHealth.split(",").map(item => item.trim()).filter(Boolean) : [],
                height: fData.height ? Number(fData.height) : 0,
                weight: fData.weight ? Number(fData.weight) : 0,
                addictions: fData.addictions ? fData.addictions.split(",").map(item => item.trim()).filter(Boolean) : [],
                disabilities: fData.disabilities ? fData.disabilities.split(",").map(item => item.trim()).filter(Boolean) : [],
                prothesis_or_medical_devices: fData.prothesisOrMedicalDevices ? fData.prothesisOrMedicalDevices.split(",").map(item => item.trim()).filter(Boolean) : [],
            };

            await updateBeneficiary(beneficiaryId, {
                full_name: fData.fullName,
                image_url: imageUrl || "",
                birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : fData.birthdate,
                email: fData.email,
                gender: fData.gender === "other" ? fData.otherGender : fData.gender,
                civil_status:
                    fData.civilStatus === "other" ? fData.otherCivilStatus : fData.civilStatus,
                education: fData.education === "other" ? fData.otherEducation : fData.education,
                occupation: fData.occupation,
                spoken_languages: languages.map(lang => lang.value),
                phones: phone ? [phone] : [],
                address: {
                    address_line_1: fData.addressLine1,
                    address_line_2: fData.addressLine2,
                    city: fData.city,
                    district: fData.state,
                    zip_code: fData.postalCode,
                    country: fData.country,
                },
                medical_information: medicalData,
                notes: notes,
                documents: [
                    {
                        type: fData.documentType,
                        value: fData.documentValue,
                    },
                ],
                emergency_contacts: [
                    {
                        phones: emergencyPhone ? [emergencyPhone] : [],
                        emails: [fData.emergencyEmail],
                        full_name: fData.emergencyName,
                        relationship: relationship,
                    },
                ],
            });

            toast({
                title: dict.commons.beneficiaries.edit.toastSuccessTitle,
                description: dict.commons.beneficiaries.edit.toastSuccessDescription,
                variant: "success",
            });

            router.push(urlPath);
        } catch (err) {
            toast({
                title: dict.commons.beneficiaries.edit.toastErrorTitle,
                description: dict.commons.beneficiaries.edit.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.commons.beneficiaries.edit.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.beneficiaries.edit.somethingWentWrong}
            </span>
        );

    if (data) {
        return (
            <div className="w-full h-max p-4">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3 mb-6">
                    <FaUsers />
                    {dict.commons.beneficiaries.edit.title}
                </h1>

                <form
                    id="beneficiary-edit-form"
                    className="w-full h-max flex flex-col min-custom:flex-row gap-6"
                    onSubmit={handleSubmit}
                >
                    {/* Left Column */}
                    <div className="w-full min-custom:w-1/2 h-max flex flex-col gap-6">
                        {/* Profile Image Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaUser /> Profile Picture
                            </h2>
                            
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-relif-orange-200 bg-slate-50 flex items-center justify-center">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Profile Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <FaUser size={36} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col items-center gap-2">
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
                                <Label htmlFor="fullName">{dict.commons.beneficiaries.edit.fullName} *</Label>
                                <Input 
                                    id="fullName" 
                                    name="fullName" 
                                    type="text" 
                                    required 
                                    defaultValue={data.full_name}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="birthdate">
                                    {dict.commons.beneficiaries.edit.birthdate} *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="birthdate"
                                        name="birthdate"
                                        type="text"
                                        placeholder="DD/MM/YYYY or click calendar"
                                        value={birthdate ? format(birthdate, "dd/MM/yyyy") : ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Try to parse different date formats
                                            if (value) {
                                                // Handle DD/MM/YYYY format
                                                const parts = value.split('/');
                                                if (parts.length === 3) {
                                                    const day = parseInt(parts[0]);
                                                    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
                                                    const year = parseInt(parts[2]);
                                                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                                        const date = new Date(year, month, day);
                                                        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                                                            setBirthdate(date);
                                                        }
                                                    }
                                                }
                                            } else {
                                                setBirthdate(undefined);
                                            }
                                        }}
                                        className="pr-10"
                                        required
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                                            >
                                                <CalendarDays className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={birthdate}
                                                onSelect={setBirthdate}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="document">{dict.commons.beneficiaries.edit.document} *</Label>
                                <div className="w-full flex gap-2">
                                    <Select name="documentType" required defaultValue={data.documents[0]?.type}>
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
                                        placeholder={dict.commons.beneficiaries.edit.documentValuePlaceholder}
                                        required
                                        defaultValue={data.documents[0]?.value}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="email">{dict.commons.beneficiaries.edit.email} *</Label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    required 
                                    defaultValue={data.email}
                                />
                            </div>

                            <Gender defaultValue={data.gender} />

                            <CivilStatus defaultValue={data.civil_status} />

                            <Education defaultValue={data.education} />

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="occupation">
                                    {dict.commons.beneficiaries.edit.occupation} *
                                </Label>
                                <Input 
                                    id="occupation" 
                                    name="occupation" 
                                    type="text" 
                                    required 
                                    defaultValue={data.occupation}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="phone">{dict.commons.beneficiaries.edit.phone} *</Label>
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
                                    {dict.commons.beneficiaries.edit.languages} *
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

                        {/* Last Address Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaMapMarkerAlt /> {dict.commons.beneficiaries.edit.lastAddress}
                            </h2>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="addressLine1">
                                    {dict.commons.beneficiaries.edit.addressLine} 1 *
                                </Label>
                                <Input 
                                    id="addressLine1" 
                                    name="addressLine1" 
                                    type="text" 
                                    required 
                                    defaultValue={data.address.address_line_1}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="addressLine2">
                                    {dict.commons.beneficiaries.edit.addressLine} 2
                                </Label>
                                <Input 
                                    id="addressLine2" 
                                    name="addressLine2" 
                                    type="text" 
                                    defaultValue={data.address.address_line_2}
                                />
                            </div>

                            <div className="w-full flex items-center gap-2">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="city">{dict.commons.beneficiaries.edit.city} *</Label>
                                    <Input 
                                        id="city" 
                                        name="city" 
                                        type="text" 
                                        required 
                                        defaultValue={data.address.city}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="postalCode">
                                        {dict.commons.beneficiaries.edit.postalCode} *
                                    </Label>
                                    <Input 
                                        id="postalCode" 
                                        name="postalCode" 
                                        type="text" 
                                        required 
                                        defaultValue={data.address.zip_code}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center gap-2">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="state">
                                        {dict.commons.beneficiaries.edit.state} *
                                    </Label>
                                    <Input 
                                        id="state" 
                                        name="state" 
                                        type="text" 
                                        required 
                                        defaultValue={data.address.district}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="country">
                                        {dict.commons.beneficiaries.edit.country} *
                                    </Label>
                                    <Input 
                                        id="country" 
                                        name="country" 
                                        type="text" 
                                        required 
                                        defaultValue={data.address.country}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <MdContacts /> {dict.commons.beneficiaries.edit.emergencyContact}
                            </h2>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="emergencyName">
                                    {dict.commons.beneficiaries.edit.emergencyName} *
                                </Label>
                                <Input 
                                    id="emergencyName" 
                                    name="emergencyName" 
                                    type="text" 
                                    required 
                                    defaultValue={data.emergency_contacts[0]?.full_name}
                                />
                            </div>

                            <RelationshipDegree
                                defaultValue={data.emergency_contacts[0]?.relationship}
                            />

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="emergencyPhone">
                                    {dict.commons.beneficiaries.edit.emergencyPhone} *
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
                                    {dict.commons.beneficiaries.edit.emergencyEmail} *
                                </Label>
                                <Input 
                                    id="emergencyEmail" 
                                    name="emergencyEmail" 
                                    type="email" 
                                    required 
                                    defaultValue={data.emergency_contacts[0]?.emails[0]}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="w-full min-custom:w-1/2 h-max flex flex-col gap-6">
                        {/* Notes Section */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaUser /> Additional Notes
                            </h2>
                            
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="notes">
                                    Notes (Optional)
                                </Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Add any additional information about the beneficiary..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Medical Information Section with Skip Option */}
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                    <MdContacts /> Beneficiary Health Information
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
                                <Medical defaultValue={data.medical_information} />
                            </div>
                        </div>

                        {/* Action Buttons - After Medical Information */}
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.push(urlPath)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <MdSave size={16} className="mr-2" />
                                {dict.commons.beneficiaries.edit.updateBeneficiaryButton}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    return <div />;
};

export { Form };
