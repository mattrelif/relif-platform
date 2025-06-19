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
import { generateProfileImageUploadLink } from "@/repository/beneficiary.repository";
import { createBeneficiary } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState, useEffect } from "react";
import { FaUsers, FaMapMarkerAlt, FaUpload, FaUser, FaUserCheck } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
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
import { AddressAutocomplete, AddressData } from "@/components/ui/address-autocomplete";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";

interface LanguageOption {
    value: string;
    label: string;
}

interface EmergencyContact {
    id: string;
    fullName: string;
    relationship: string;
    otherRelationship?: string;
    phone: string;
    email: string;
}

const Form = (): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const dict = useDictionary();
    
    // Debug: Log dictionary to see what's available
    console.log("Dictionary:", dict);
    console.log("Beneficiaries create title:", dict?.commons?.beneficiaries?.create?.title);

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [languages, setLanguages] = useState<LanguageOption[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>("");
    const [skipMedicalInfo, setSkipMedicalInfo] = useState<boolean>(false);
    const [skipEmergencyContact, setSkipEmergencyContact] = useState<boolean>(false);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
        {
            id: crypto.randomUUID(),
            fullName: "",
            relationship: "",
            otherRelationship: "",
            phone: "",
            email: ""
        }
    ]);
    const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
    const [birthdateInput, setBirthdateInput] = useState<string>("");
    const [birthdateError, setBirthdateError] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [requiresReview, setRequiresReview] = useState<boolean>(false);
    const [wantToAllocate, setWantToAllocate] = useState<boolean>(false);
    const [hasNoEmail, setHasNoEmail] = useState<boolean>(false);
    const [hasNoPhone, setHasNoPhone] = useState<boolean>(false);
    
    // Google Places integration
    const { apiKey, isReady } = useGooglePlaces();
    const [addressData, setAddressData] = useState<AddressData | null>(null);

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

    const addEmergencyContact = () => {
        setEmergencyContacts(prev => [...prev, {
            id: crypto.randomUUID(),
            fullName: "",
            relationship: "",
            otherRelationship: "",
            phone: "",
            email: ""
        }]);
    };

    const removeEmergencyContact = (id: string) => {
        setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
    };

    const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string) => {
        setEmergencyContacts(prev => prev.map(contact => 
            contact.id === id ? { ...contact, [field]: value } : contact
        ));
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

            // Validate address fields (from autocomplete or manual input)
            const addressToUse = addressData || {
                address_line_1: data.addressLine1 || "",
                address_line_2: data.addressLine2 || "",
                city: data.city || "",
                district: data.state || "",
                zip_code: data.postalCode || "",
                country: data.country || "",
            };
            
            if (!addressToUse.address_line_1 || !addressToUse.city || !addressToUse.zip_code || !addressToUse.district || !addressToUse.country) {
                throw new Error("Address fields (address line 1, city, postal code, state, country) are required");
            }

            // Validate emergency contact fields (only if not skipped)
            if (!skipEmergencyContact && emergencyContacts.length > 0) {
                emergencyContacts.forEach((contact, index) => {
                    if (!contact.fullName || contact.fullName.trim() === "") {
                        throw new Error(`Emergency contact ${index + 1}: Name is required`);
                    }
                    if (!contact.relationship || contact.relationship.trim() === "") {
                        throw new Error(`Emergency contact ${index + 1}: Relationship is required`);
                    }
                    if (!contact.phone || contact.phone.trim() === "") {
                        throw new Error(`Emergency contact ${index + 1}: Phone is required`);
                    }
                    if (!contact.email || contact.email.trim() === "") {
                        throw new Error(`Emergency contact ${index + 1}: Email is required`);
                    }
                });
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

            // Validate emergency contact relationship (only if not skipped)
            let relationship = "";
            if (!skipEmergencyContact) {
                relationship = data.emergencyRelationship === "other" ? data.otherEmergencyRelationship : data.emergencyRelationship;
                if (!relationship || relationship.trim() === "") {
                    throw new Error("Emergency contact relationship is required");
                }
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

            const response = await createBeneficiary(currentUser.organization_id, {
                full_name: data.fullName,
                image_url: imageUrl || "",
                birthdate: data.birthdate,
                email: hasNoEmail ? "" : data.email,
                gender: data.gender === "other" ? data.otherGender : data.gender,
                civil_status: data.civilStatus === "other" ? data.otherCivilStatus : data.civilStatus,
                education: data.education === "other" ? data.otherEducation : data.education,
                occupation: data.occupation,
                spoken_languages: languages.map(lang => lang.value),
                phones: hasNoPhone ? [] : (phone ? [phone] : []),
                address: {
                    address_line_1: addressToUse.address_line_1,
                    address_line_2: addressToUse.address_line_2,
                    city: addressToUse.city,
                    district: addressToUse.district,
                    zip_code: addressToUse.zip_code,
                    country: addressToUse.country,
                },
                medical_information: medicalData,
                notes: notes,
                status: requiresReview ? "PENDING" : "ACTIVE",
                documents: [
                    {
                        type: data.documentType,
                        value: data.documentValue,
                    },
                ],
                emergency_contacts: skipEmergencyContact ? [] : emergencyContacts
                    .filter(contact => contact.fullName.trim() !== "")
                    .map(contact => ({
                        full_name: contact.fullName,
                        relationship: contact.relationship === "other" ? (contact.otherRelationship || "") : contact.relationship,
                        phones: contact.phone ? [contact.phone] : [],
                        emails: [contact.email],
                    })),
            });

            toast({
                title: dict.commons.beneficiaries.create.toastSuccessTitle,
                description: dict.commons.beneficiaries.create.toastSuccessDescription,
            });

            // Check if user wants to allocate and redirect accordingly
            if (wantToAllocate && response.data && response.data.id) {
                router.push(`${urlPath}/create/${response.data.id}/allocate`);
            } else {
                router.push(urlPath);
            }
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
        <div className="w-full h-max p-4">
            <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3 mb-6">
                <FaUsers />
                {dict?.commons?.beneficiaries?.create?.title || "Create Beneficiary"}
            </h1>

            <form
                id="beneficiary-form"
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
                            <Label htmlFor="fullName">{dict.commons.beneficiaries.create.fullName} *</Label>
                            <Input id="fullName" name="fullName" type="text" required />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="birthdate">
                                {dict.commons.beneficiaries.create.birthdate} *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="birthdate"
                                    name="birthdate"
                                    type="text"
                                    placeholder="DD/MM/YYYY or click calendar"
                                    value={birthdate ? format(birthdate, "dd/MM/yyyy") : birthdateInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setBirthdateInput(value);
                                        setBirthdateError(""); // Clear error while typing
                                        
                                        // Clear the date if input is empty
                                        if (!value) {
                                            setBirthdate(undefined);
                                            return;
                                        }
                                        
                                        // Only try to parse when we have a complete date (10 characters: DD/MM/YYYY)
                                        if (value.length === 10) {
                                            const parts = value.split('/');
                                            if (parts.length === 3) {
                                                const day = parseInt(parts[0]);
                                                const month = parseInt(parts[1]) - 1; // Month is 0-indexed
                                                const year = parseInt(parts[2]);
                                                
                                                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                                    const date = new Date(year, month, day);
                                                    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                                                        // Check if date is within valid range
                                                        const today = new Date();
                                                        const minDate = new Date(1900, 0, 1);
                                                        
                                                        if (date > today) {
                                                            setBirthdateError("Birthdate cannot be in the future");
                                                        } else if (date < minDate) {
                                                            setBirthdateError("Birthdate cannot be before year 1900");
                                                        } else {
                                                            setBirthdate(date);
                                                            setBirthdateError("");
                                                        }
                                                        return;
                                                    }
                                                }
                                            }
                                            // Show error for invalid format when 10 characters are entered
                                            setBirthdateError("Invalid date format. Use DD/MM/YYYY");
                                        } else if (value.length > 10) {
                                            // Prevent typing more than 10 characters
                                            setBirthdateInput(value.slice(0, 10));
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
                                            onSelect={(date) => {
                                                setBirthdate(date);
                                                setBirthdateInput(""); // Clear input when date is selected from calendar
                                                setBirthdateError(""); // Clear any errors
                                            }}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            captionLayout="dropdown"
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            defaultMonth={birthdate || new Date(1990, 0)} // Default to year 1990 for better UX
                                            classNames={{
                                                caption: "flex justify-center pt-1 relative items-center",
                                                caption_label: "hidden", // Hide the duplicate title
                                                caption_dropdowns: "flex justify-center gap-2",
                                                dropdown_month: "text-sm font-medium border border-slate-200 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-relif-orange-200",
                                                dropdown_year: "text-sm font-medium border border-slate-200 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-relif-orange-200",
                                                head_cell: "text-slate-500 rounded-md w-9 font-normal text-sm",
                                                cell: "text-sm",
                                                day: "h-9 w-9 p-0 font-normal text-sm hover:bg-slate-100 focus:bg-slate-100",
                                                day_selected: "bg-relif-orange-500 text-white hover:bg-relif-orange-600 focus:bg-relif-orange-600",
                                                day_today: "bg-slate-100 text-slate-900 font-semibold",
                                                day_outside: "text-slate-400 opacity-50",
                                                day_disabled: "text-slate-400 opacity-50",
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {birthdateError && (
                                <p className="text-sm text-red-500 mt-1">{birthdateError}</p>
                            )}
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
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="documentValue"
                                    name="documentValue"
                                    type="text"
                                    className="w-[50%]"
                                    placeholder="12345678910"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">
                                {dict.commons.beneficiaries.create.email} {!hasNoEmail && "*"}
                            </Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                required={!hasNoEmail}
                                className={hasNoEmail ? "opacity-50 pointer-events-none" : ""}
                            />
                            <div className="flex items-center space-x-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <Checkbox 
                                    id="hasNoEmail" 
                                    checked={hasNoEmail}
                                    onCheckedChange={(checked) => setHasNoEmail(checked as boolean)}
                                />
                                <Label htmlFor="hasNoEmail" className="text-sm font-normal text-gray-700 cursor-pointer">
                                    ✓ Beneficiary has no email
                                </Label>
                            </div>
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
                            <Label htmlFor="phone">
                                {dict.commons.beneficiaries.create.phone} {!hasNoPhone && "*"}
                            </Label>
                            <div className={hasNoPhone ? "opacity-50 pointer-events-none" : ""}>
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
                                        required: !hasNoPhone,
                                    }}
                                />
                            </div>
                            <div className="flex items-center space-x-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                <Checkbox 
                                    id="hasNoPhone" 
                                    checked={hasNoPhone}
                                    onCheckedChange={(checked) => {
                                        setHasNoPhone(checked as boolean);
                                        if (checked) setPhone("");
                                    }}
                                />
                                <Label htmlFor="hasNoPhone" className="text-sm font-normal text-gray-700 cursor-pointer">
                                    ✓ Beneficiary has no phone
                                </Label>
                            </div>
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

                    {/* Last Address Section with Google Places Autocomplete */}
                    {isReady ? (
                        <AddressAutocomplete
                            googleApiKey={apiKey}
                            onAddressSelect={setAddressData}
                            labels={{
                                sectionTitle: dict.commons.beneficiaries.create.lastAddress,
                                addressLine1: dict.commons.beneficiaries.create.addressLine + " 1",
                                addressLine2: dict.commons.beneficiaries.create.addressLine + " 2",
                                city: dict.commons.beneficiaries.create.city,
                                state: dict.commons.beneficiaries.create.state,
                                zipCode: dict.commons.beneficiaries.create.postalCode,
                                country: dict.commons.beneficiaries.create.country
                            }}
                            required={true}
                        />
                    ) : (
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaMapMarkerAlt /> {dict.commons.beneficiaries.create.lastAddress}
                            </h2>
                            <div className="p-4 text-gray-500 text-sm">
                                Google Places API not configured. Using manual entry.
                            </div>

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
                    )}

                    {/* Emergency Contact Section */}
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <MdContacts /> {dict.commons.beneficiaries.create.emergencyContact}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="skipEmergencyContact" 
                                    checked={skipEmergencyContact}
                                    onCheckedChange={(checked) => setSkipEmergencyContact(checked as boolean)}
                                />
                                <Label htmlFor="skipEmergencyContact" className="text-sm font-normal">
                                    Skip emergency contact
                                </Label>
                            </div>
                        </div>

                        <div className={skipEmergencyContact ? "opacity-50 pointer-events-none" : ""}>
                            <div className="flex flex-col gap-4">
                                {emergencyContacts.map((contact, index) => (
                                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-700">
                                                Emergency Contact {index + 1}
                                            </h3>
                                            {emergencyContacts.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeEmergencyContact(contact.id)}
                                                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                                    disabled={skipEmergencyContact}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor={`emergencyName-${contact.id}`}>
                                                    {dict.commons.beneficiaries.create.emergencyName} *
                                                </Label>
                                                <Input
                                                    id={`emergencyName-${contact.id}`}
                                                    type="text"
                                                    value={contact.fullName}
                                                    onChange={(e) => updateEmergencyContact(contact.id, 'fullName', e.target.value)}
                                                    required={!skipEmergencyContact}
                                                    disabled={skipEmergencyContact}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor={`emergencyEmail-${contact.id}`}>
                                                    {dict.commons.beneficiaries.create.emergencyEmail} *
                                                </Label>
                                                <Input
                                                    id={`emergencyEmail-${contact.id}`}
                                                    type="email"
                                                    value={contact.email}
                                                    onChange={(e) => updateEmergencyContact(contact.id, 'email', e.target.value)}
                                                    required={!skipEmergencyContact}
                                                    disabled={skipEmergencyContact}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor={`emergencyPhone-${contact.id}`}>
                                                    {dict.commons.beneficiaries.create.emergencyPhone} *
                                                </Label>
                                                <PhoneInput
                                                    country={"us"}
                                                    value={contact.phone}
                                                    onChange={(value: string) => updateEmergencyContact(contact.id, 'phone', value)}
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
                                                        required: !skipEmergencyContact,
                                                        disabled: skipEmergencyContact,
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor={`emergencyRelationship-${contact.id}`}>
                                                    Relationship *
                                                </Label>
                                                <Select
                                                    value={contact.relationship}
                                                    onValueChange={(value) => updateEmergencyContact(contact.id, 'relationship', value)}
                                                    disabled={skipEmergencyContact}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select relationship" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="parent">Parent</SelectItem>
                                                        <SelectItem value="spouse">Spouse</SelectItem>
                                                        <SelectItem value="sibling">Sibling</SelectItem>
                                                        <SelectItem value="child">Child</SelectItem>
                                                        <SelectItem value="friend">Friend</SelectItem>
                                                        <SelectItem value="guardian">Guardian</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {contact.relationship === "other" && (
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor={`otherRelationship-${contact.id}`}>
                                                    Please specify relationship *
                                                </Label>
                                                <Input
                                                    id={`otherRelationship-${contact.id}`}
                                                    type="text"
                                                    value={contact.otherRelationship || ""}
                                                    onChange={(e) => updateEmergencyContact(contact.id, 'otherRelationship', e.target.value)}
                                                    placeholder="e.g., Cousin, Neighbor, etc."
                                                    required={!skipEmergencyContact}
                                                    disabled={skipEmergencyContact}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {!skipEmergencyContact && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addEmergencyContact}
                                        className="w-full border-dashed border-relif-orange-200 text-relif-orange-500 hover:bg-relif-orange-50"
                                    >
                                        + Add Another Emergency Contact
                                    </Button>
                                )}
                            </div>
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
                            <Medical />
                        </div>
                    </div>

                    {/* Review Status Section */}
                    <div className="w-full h-max flex flex-col gap-4 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaUserCheck /> Registration Status
                        </h2>
                        
                        <div className="flex items-start space-x-3">
                            <Checkbox 
                                id="requiresReview" 
                                checked={requiresReview}
                                onCheckedChange={(checked) => setRequiresReview(checked as boolean)}
                                className="mt-1"
                            />
                            <div className="space-y-1">
                                <Label htmlFor="requiresReview" className="text-sm font-medium cursor-pointer">
                                    This beneficiary requires review before activation
                                </Label>
                                <p className="text-xs text-gray-600">
                                    Check this if the beneficiary's information needs verification, document review, 
                                    or administrative approval before they can receive services. 
                                    {requiresReview ? (
                                        <span className="text-orange-600 font-medium"> Status will be set to PENDING.</span>
                                    ) : (
                                        <span className="text-green-600 font-medium"> Status will be set to ACTIVE.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Allocation Option Section */}
                    <div className="w-full h-max flex flex-col gap-4 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaHouseChimneyUser /> Housing Allocation
                        </h2>
                        
                        <div className="flex items-start space-x-3">
                            <Checkbox 
                                id="wantToAllocate" 
                                checked={wantToAllocate}
                                onCheckedChange={(checked) => setWantToAllocate(checked as boolean)}
                                className="mt-1"
                            />
                            <div className="space-y-1">
                                <Label htmlFor="wantToAllocate" className="text-sm font-medium cursor-pointer">
                                    Allocate to housing after creation
                                </Label>
                                <p className="text-xs text-gray-600">
                                    Check this to immediately proceed to housing allocation after creating the beneficiary. 
                                    You can also allocate them to housing later from the beneficiary list.
                                    {wantToAllocate && (
                                        <span className="text-blue-600 font-medium"> You will be redirected to the allocation page.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - After Review Status */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.push(urlPath)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {wantToAllocate ? "Create & Allocate" : "Create Beneficiary"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export { Form };
