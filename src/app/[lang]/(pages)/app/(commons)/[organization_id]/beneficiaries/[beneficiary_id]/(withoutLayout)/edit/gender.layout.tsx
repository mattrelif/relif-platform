"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReactNode, useEffect, useState } from "react";

type Props = {
    defaultValue: string;
};

const OPTIONS = [
    "male",
    "female",
    "non-binary",
    "prefer-not-to-say",
    "transgender",
    "gender-fluid",
    "agender",
    "other",
];

const Gender = ({ defaultValue }: Props): ReactNode => {
    const [option, setOption] = useState<string>(defaultValue);

    useEffect(() => {
        if (OPTIONS.includes(defaultValue)) {
            setOption(defaultValue);
        } else {
            setOption("other");
        }
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="gender">Gender *</Label>
            <Select name="gender" value={option} onValueChange={opt => setOption(opt)}>
                <SelectTrigger className="w-full" id="gender">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="transgender">Transgender</SelectItem>
                    <SelectItem value="gender-fluid">Gender Fluid</SelectItem>
                    <SelectItem value="agender">Agender</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input name="otherGender" type="text" placeholder="Specify gender" required />
            )}
        </div>
    );
};

export { Gender };
