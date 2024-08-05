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
    "incomplete-elementary-education",
    "complete-elementary-education",
    "incomplete-high-school",
    "complete-high-school",
    "vocational-education",
    "incomplete-higher-education",
    "complete-higher-education",
    "postgraduate",
    "masters-degree",
    "doctorate",
    "postdoctorate",
];

const Education = ({ defaultValue }: Props): ReactNode => {
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
            <Label htmlFor="education">Education *</Label>
            <Select name="education" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="education">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="incomplete-elementary-education">
                        Incomplete Elementary Education
                    </SelectItem>
                    <SelectItem value="complete-elementary-education">
                        Complete Elementary Education
                    </SelectItem>
                    <SelectItem value="incomplete-high-school">Incomplete High School</SelectItem>
                    <SelectItem value="complete-high-school">Complete High School</SelectItem>
                    <SelectItem value="vocational-education">Vocational Education</SelectItem>
                    <SelectItem value="incomplete-higher-education">
                        Incomplete Higher Education
                    </SelectItem>
                    <SelectItem value="complete-higher-education">
                        Complete Higher Education
                    </SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="masters-degree">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                    <SelectItem value="postdoctorate">Postdoctorate</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input name="otherEducation" type="text" placeholder="Specify education" />
            )}
        </div>
    );
};

export { Education };
