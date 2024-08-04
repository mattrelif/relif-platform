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
    "single",
    "married",
    "divorced",
    "widowed",
    "separated",
    "common-law-marriage",
    "in-a-relationship",
];

const CivilStatus = ({ defaultValue }: Props): ReactNode => {
    const [option, setOption] = useState<string>("other");
    const [customOption, setCustomOption] = useState<string>("");

    useEffect(() => {
        if (OPTIONS.includes(defaultValue)) {
            setOption(defaultValue);
        } else {
            setOption("other");
            setCustomOption(defaultValue);
        }
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="civilStatus">Civil Status *</Label>
            <Select name="civilStatus" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="civilStatus">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                    <SelectItem value="common-law-marriage">Common-Law Marriage</SelectItem>
                    <SelectItem value="in-a-relationship">In a Relationship</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherCivilStatus"
                    type="text"
                    placeholder="Specify civil status"
                    value={customOption}
                    onChange={e => setCustomOption(e.target.value)}
                />
            )}
        </div>
    );
};

export { CivilStatus };
