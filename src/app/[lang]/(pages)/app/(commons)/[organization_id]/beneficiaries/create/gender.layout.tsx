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
import { ReactNode, useState } from "react";

const Gender = (): ReactNode => {
    const [option, setOption] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="gender">Gender *</Label>
            <Select name="gender" onValueChange={opt => setOption(opt)}>
                <SelectTrigger className="w-full" id="gender" defaultValue="male">
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
                <Input name="otherGender" type="text" placeholder="Specify gender" />
            )}
        </div>
    );
};

export { Gender };
