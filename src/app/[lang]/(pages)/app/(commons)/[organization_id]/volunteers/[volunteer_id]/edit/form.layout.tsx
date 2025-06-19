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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { updateVolunteer } from "@/repository/volunteer.repository";
import { UserSchema } from "@/types/user.types";
import { formatDate } from "@/utils/formatDate";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FaEdit, FaMapMarkerAlt, FaUser, FaUsers } from "react-icons/fa";
import { MdContacts } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Gender } from "../../create/gender.layout";
import { Medical } from "../../create/medical.layout";
import { RelationshipDegree } from "../../create/relationship.layout";
import { AddressAutocomplete, AddressData } from "@/components/ui/address-autocomplete";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";

// Tipo para os dados do voluntário
interface VolunteerData {
    full_name: string;
    birthdate: string;
    email: string;
    gender: string;
    phones: string[];
    address: {
        address_line_1: string;
        address_line_2: string;
        city: string;
        district: string;
        zip_code: string;
        country: string;
    };
    segments: string[];
    documents: Array<{
        type: string;
        value: string;
    }>;
    medical_information: {
        allergies: string[];
        current_medications: string[];
        recurrent_medical_conditions: string[];
        health_insurance_plans: string[];
        blood_type: string;
        taken_vaccines: string[];
        mental_health_history: string[];
        height: number;
        weight: number;
        addictions: string[];
        disabilities: string[];
        prothesis_or_medical_devices: string[];
    };
    emergency_contacts: Array<{
        full_name: string;
        relationship: string;
        phones: string[];
        emails: string[];
    }>;
    notes?: string;
}

interface FormProps {
    volunteerId: string;
    volunteerData: VolunteerData;
}

const Form = ({ volunteerId, volunteerData }: FormProps): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();
    const { toast } = useToast();
    const [phone, setPhone] = useState<string>(volunteerData.phones[0] || "");
    const [emergencyPhone, setEmergencyPhone] = useState<string>(
        volunteerData.emergency_contacts[0]?.phones[0] || ""
    );
    const [skipMedicalInfo, setSkipMedicalInfo] = useState<boolean>(false);
    const [skipEmergencyContact, setSkipEmergencyContact] = useState<boolean>(
        volunteerData.emergency_contacts.length === 0
    );
    const [notes, setNotes] = useState<string>(volunteerData.notes || "");
    const [birthdate, setBirthdate] = useState<Date | undefined>(
        volunteerData.birthdate ? new Date(volunteerData.birthdate) : undefined
    );
    const [birthdateInput, setBirthdateInput] = useState<string>("");
    const [birthdateError, setBirthdateError] = useState<string>("");

    // Google Places integration
    const { apiKey, isReady } = useGooglePlaces();
    const [addressData, setAddressData] = useState<AddressData | null>(null);

    // Initialize address data with current volunteer data
    useEffect(() => {
        if (volunteerData.address) {
            setAddressData({
                address_line_1: volunteerData.address.address_line_1 || "",
                address_line_2: volunteerData.address.address_line_2 || "",
                city: volunteerData.address.city || "",
                district: volunteerData.address.district || "",
                zip_code: volunteerData.address.zip_code || "",
                country: volunteerData.address.country || "",
            });
        }
    }, [volunteerData.address]);

    // Check if medical info is empty to set default skip state
    useEffect(() => {
        const medInfo = volunteerData.medical_information;
        const isEmpty = !medInfo || (
            medInfo.allergies.length === 0 &&
            medInfo.current_medications.length === 0 &&
            medInfo.recurrent_medical_conditions.length === 0 &&
            medInfo.health_insurance_plans.length === 0 &&
            !medInfo.blood_type &&
            medInfo.taken_vaccines.length === 0 &&
            medInfo.mental_health_history.length === 0 &&
            medInfo.height === 0 &&
            medInfo.weight === 0 &&
            medInfo.addictions.length === 0 &&
            medInfo.disabilities.length === 0 &&
            medInfo.prothesis_or_medical_devices.length === 0
        );
        setSkipMedicalInfo(isEmpty);
    }, [volunteerData.medical_information]);

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 6).join("/");

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                fullName: string;
                email: string;
                gender: string;
                otherGender: string;
                documentType: string;
                documentValue: string;
                segments: string;
                allergies?: string;
                currentMedications?: string;
                chronicMedicalConditions?: string;
                healthInsurance?: string;
                bloodType?: string;
                vaccinations?: string;
                mentalHealth?: string;
                height?: number;
                weight?: number;
                addictions?: string;
                disabilities?: string;
                prothesisOrMedicalDevices?: string;
                emergencyName?: string;
                emergencyRelationship?: string;
                otherEmergencyRelationship?: string;
                emergencyEmail?: string;
            } = Object.fromEntries(formData);

            if (currentUser?.organization_id) {
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

                const emergencyContacts = skipEmergencyContact ? [] : [
                    {
                        phones: emergencyPhone ? [emergencyPhone] : [],
                        emails: data.emergencyEmail ? [data.emergencyEmail] : [],
                        full_name: data.emergencyName || "",
                        relationship: data.emergencyRelationship === "other"
                            ? data.otherEmergencyRelationship || ""
                            : data.emergencyRelationship || "",
                    },
                ];

                // Use address data from autocomplete or fallback to manual entry
                const addressToUse = addressData || {
                    address_line_1: formData.get('addressLine1') as string || "",
                    address_line_2: formData.get('addressLine2') as string || "",
                    city: formData.get('city') as string || "",
                    district: formData.get('state') as string || "",
                    zip_code: formData.get('postalCode') as string || "",
                    country: formData.get('country') as string || "",
                };

                if (!birthdate) {
                    throw new Error("Birthdate is required");
                }

                await updateVolunteer(volunteerId, {
                    full_name: data.fullName,
                    birthdate: birthdate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
                    email: data.email,
                    gender: data.gender === "other" ? data.otherGender : data.gender,
                    segments: data.segments.split(",").filter(item => item.trim()),
                    phones: phone ? [phone] : [],
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
                    documents: [
                        {
                            type: data.documentType,
                            value: data.documentValue,
                        },
                    ],
                    emergency_contacts: emergencyContacts,
                });

                toast({
                    title: dict.commons.volunteers.edit.updateSuccessful,
                    description: dict.commons.volunteers.edit.volunteerUpdatedSuccessfully,
                    variant: "success",
                });

                router.push(urlPath);
            } else {
                throw new Error("Organization ID is required");
            }
        } catch (err: any) {
            toast({
                title: dict.commons.volunteers.edit.updateError,
                description: `${dict.commons.volunteers.edit.updateErrorDescription} ${err instanceof Error ? err.message : ""}`,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full h-max p-4">
            <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3 mb-6">
                <FaUsers />
                {dict.commons.volunteers.edit.editVolunteer}
            </h1>

            <form
                id="volunteer-form"
                className="w-full h-max flex flex-col min-custom:flex-row gap-6"
                onSubmit={handleSubmit}
            >
                {/* Left Column */}
                <div className="w-full min-custom:w-1/2 h-max flex flex-col gap-6">
                    {/* Basic Information Section */}
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaUser /> Basic Information
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="fullName">{dict.commons.volunteers.edit.fullName} *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                defaultValue={volunteerData.full_name}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="birthdate">
                                {dict.commons.volunteers.edit.birthdate} *
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
                            <Label htmlFor="document">{dict.commons.volunteers.edit.document} *</Label>
                            <div className="w-full flex gap-2">
                                <Select
                                    name="documentType"
                                    defaultValue={volunteerData.documents[0]?.type || ""}
                                    required
                                >
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
                                    defaultValue={volunteerData.documents[0]?.value || ""}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">{dict.commons.volunteers.edit.email} *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={volunteerData.email}
                                required
                            />
                        </div>

                        <Gender defaultValue={volunteerData.gender} />

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="phone">{dict.commons.volunteers.edit.phone} *</Label>
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
                            <Label htmlFor="segments">{dict.commons.volunteers.edit.segments} *</Label>
                            <Input
                                id="segments"
                                name="segments"
                                type="text"
                                defaultValue={volunteerData.segments.join(", ")}
                                placeholder={dict.commons.volunteers.edit.segmentsPlaceholder}
                                required
                            />
                        </div>
                    </div>

                    {/* Address Section with Google Places Autocomplete */}
                    {isReady ? (
                        <AddressAutocomplete
                            googleApiKey={apiKey}
                            onAddressSelect={setAddressData}
                            defaultValues={volunteerData.address}
                            labels={{
                                sectionTitle: dict.commons.volunteers.edit.address,
                                addressLine1: dict.commons.volunteers.edit.addressLine + " 1",
                                addressLine2: dict.commons.volunteers.edit.addressLine + " 2",
                                city: dict.commons.volunteers.edit.city,
                                state: dict.commons.volunteers.edit.state,
                                zipCode: dict.commons.volunteers.edit.postalCode,
                                country: dict.commons.volunteers.edit.country
                            }}
                            required={true}
                        />
                    ) : (
                        <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <FaMapMarkerAlt /> {dict.commons.volunteers.edit.address}
                            </h2>
                            <div className="p-4 text-gray-500 text-sm">
                                Google Places API not configured. Using manual entry.
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="addressLine1">
                                    {dict.commons.volunteers.edit.addressLine} 1 *
                                </Label>
                                <Input
                                    id="addressLine1"
                                    name="addressLine1"
                                    type="text"
                                    defaultValue={volunteerData.address.address_line_1}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="addressLine2">
                                    {dict.commons.volunteers.edit.addressLine} 2
                                </Label>
                                <Input
                                    id="addressLine2"
                                    name="addressLine2"
                                    type="text"
                                    defaultValue={volunteerData.address.address_line_2}
                                />
                            </div>

                            <div className="w-full flex items-center gap-2">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="city">{dict.commons.volunteers.edit.city} *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        defaultValue={volunteerData.address.city}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="postalCode">
                                        {dict.commons.volunteers.edit.postalCode} *
                                    </Label>
                                    <Input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        defaultValue={volunteerData.address.zip_code}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center gap-2">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="state">{dict.commons.volunteers.edit.state} *</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        type="text"
                                        defaultValue={volunteerData.address.district}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="country">
                                        {dict.commons.volunteers.edit.country} *
                                    </Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        type="text"
                                        defaultValue={volunteerData.address.country}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Emergency Contact Section */}
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <MdContacts /> {dict.commons.volunteers.edit.emergencyContact}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="skipEmergencyContact" 
                                    checked={skipEmergencyContact}
                                    onCheckedChange={(checked: boolean) => setSkipEmergencyContact(checked)}
                                />
                                <Label htmlFor="skipEmergencyContact" className="text-sm font-normal">
                                    Skip emergency contact
                                </Label>
                            </div>
                        </div>

                        <div className={skipEmergencyContact ? "opacity-50 pointer-events-none" : ""}>
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="emergencyName">
                                            {dict.commons.volunteers.edit.emergencyName} *
                                        </Label>
                                        <Input
                                            id="emergencyName"
                                            name="emergencyName"
                                            type="text"
                                            defaultValue={volunteerData.emergency_contacts[0]?.full_name || ""}
                                            required={!skipEmergencyContact}
                                            disabled={skipEmergencyContact}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="emergencyEmail">
                                            {dict.commons.volunteers.edit.emergencyEmail} *
                                        </Label>
                                        <Input
                                            id="emergencyEmail"
                                            name="emergencyEmail"
                                            type="email"
                                            defaultValue={volunteerData.emergency_contacts[0]?.emails[0] || ""}
                                            required={!skipEmergencyContact}
                                            disabled={skipEmergencyContact}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="emergencyPhone">
                                            {dict.commons.volunteers.edit.emergencyPhone} *
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
                                                required: !skipEmergencyContact,
                                                disabled: skipEmergencyContact,
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <RelationshipDegree defaultValue={volunteerData.emergency_contacts[0]?.relationship || ""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full min-custom:w-1/2 h-max flex flex-col gap-6">
                    {/* Medical Information Section with Skip Option */}
                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                                <MdContacts /> Volunteer Health Information
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="skipMedical" 
                                    checked={skipMedicalInfo}
                                    onCheckedChange={(checked: boolean) => setSkipMedicalInfo(checked)}
                                />
                                <Label htmlFor="skipMedical" className="text-sm font-normal">
                                    Skip medical information
                                </Label>
                            </div>
                        </div>

                        <div className={skipMedicalInfo ? "opacity-50 pointer-events-none" : ""}>
                            <Medical defaultValue={volunteerData.medical_information} />
                        </div>
                    </div>

                                                            <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaUser /> Additional Information
                        </h2>

                    <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="notes">{dict.commons.volunteers.edit.notes}</Label>
                            <Textarea
                            id="notes"
                            name="notes"
                                placeholder="Add any additional information about the volunteer..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[120px] resize-none"
                        />
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex justify-end gap-4 mt-8">
                        <Button variant="outline" type="button" onClick={() => router.push(urlPath)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex items-center gap-2">
                            <FaEdit size={16} />
                            {dict.commons.volunteers.edit.updateVolunteer}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
        );
};

export { Form };
