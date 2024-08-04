"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, ReactNode, useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";

const Medical = (): ReactNode => {
    const [allergies, setAllergies] = useState<string[]>([]);
    const [currentMedications, setCurrentMedications] = useState<string[]>([]);
    const [chronicMedicalConditions, setChronicMedicalConditions] = useState<string[]>([]);
    const [healthInsurance, setHealthInsurance] = useState<string[]>([]);
    const [vaccinations, setVaccinations] = useState<string[]>([]);
    const [mentalHealth, setMentalHealth] = useState<string[]>([]);
    const [addictions, setAddictions] = useState<string[]>([]);
    const [disabilities, setDisabilities] = useState<string[]>([]);
    const [prosthesisOrMedicalDevices, setProsthesisOrMedicalDevices] = useState<string[]>([]);

    const handleInputChange =
        (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    return (
        <>
            <div className="w-full h-max flex flex-col gap-6 p-4 border border-slate-200 rounded-lg">
                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <MdHealthAndSafety /> Medical Information
                </h2>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="allergies">Allergies *</Label>
                    <Input
                        id="allergies"
                        name="allergies"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setAllergies)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {allergies?.map((allergy, index) => (
                            <Badge variant="outline" key={index}>
                                {allergy}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="currentMedications">Current medications *</Label>
                    <Input
                        id="currentMedications"
                        name="currentMedications"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setCurrentMedications)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {currentMedications?.map((medication, index) => (
                            <Badge variant="outline" key={index}>
                                {medication}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="chronicMedicalConditions">Chronic medical conditions *</Label>
                    <Input
                        id="chronicMedicalConditions"
                        name="chronicMedicalConditions"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setChronicMedicalConditions)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {chronicMedicalConditions?.map((condition, index) => (
                            <Badge variant="outline" key={index}>
                                {condition}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="healthInsurance">Health Insurance *</Label>
                    <Input
                        id="healthInsurance"
                        name="healthInsurance"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setHealthInsurance)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {healthInsurance?.map((insurance, index) => (
                            <Badge variant="outline" key={index}>
                                {insurance}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="bloodType">Blood type *</Label>
                    <Select name="bloodType" required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select blood type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A-positive">A+</SelectItem>
                            <SelectItem value="A-negative">A-</SelectItem>
                            <SelectItem value="B-positive">B+</SelectItem>
                            <SelectItem value="B-negative">B-</SelectItem>
                            <SelectItem value="AB-positive">AB+</SelectItem>
                            <SelectItem value="AB-negative">AB-</SelectItem>
                            <SelectItem value="O-positive">O+</SelectItem>
                            <SelectItem value="O-negative">O-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="vaccinations">Vaccinations *</Label>
                    <Input
                        id="vaccinations"
                        name="vaccinations"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setVaccinations)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {vaccinations?.map((vaccination, index) => (
                            <Badge variant="outline" key={index}>
                                {vaccination}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="mentalHealth">Mental health *</Label>
                    <Input
                        id="mentalHealth"
                        name="mentalHealth"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setMentalHealth)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {mentalHealth?.map((mental, index) => (
                            <Badge variant="outline" key={index}>
                                {mental}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                        id="height"
                        name="height"
                        type="number"
                        placeholder="e.g. 170cm"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="e.g. 80kg"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="addictions">Addictions *</Label>
                    <Input
                        id="addictions"
                        name="addictions"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setAddictions)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {addictions?.map((addiction, index) => (
                            <Badge variant="outline" key={index}>
                                {addiction}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="disabilities">Disabilities *</Label>
                    <Input
                        id="disabilities"
                        name="disabilities"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setDisabilities)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {disabilities?.map((disability, index) => (
                            <Badge variant="outline" key={index}>
                                {disability}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="prothesisOrMedicalDevices">
                        Use of prosthesis or medical devices *
                    </Label>
                    <Input
                        id="prothesisOrMedicalDevices"
                        name="prothesisOrMedicalDevices"
                        type="text"
                        required
                        placeholder="Write as much as you want, separated by commas"
                        onChange={handleInputChange(setProsthesisOrMedicalDevices)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {prosthesisOrMedicalDevices?.map((device, index) => (
                            <Badge variant="outline" key={index}>
                                {device}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export { Medical };
