"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
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

interface GenderProps {
    defaultValue?: string;
}

const Gender = ({ defaultValue }: GenderProps): ReactNode => {
    const [option, setOption] = useState(defaultValue || "");
    const dict = useDictionary();

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="gender">{dict.commons.volunteers.create.gender.label}</Label>
            <Select name="gender" onValueChange={opt => setOption(opt)} defaultValue={defaultValue}>
                <SelectTrigger className="w-full" id="gender">
                    <SelectValue placeholder={dict.commons.volunteers.create.gender.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">
                        {dict.commons.volunteers.create.gender.male}
                    </SelectItem>
                    <SelectItem value="female">
                        {dict.commons.volunteers.create.gender.female}
                    </SelectItem>
                    <SelectItem value="non-binary">
                        {dict.commons.volunteers.create.gender.nonBinary}
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say">
                        {dict.commons.volunteers.create.gender.preferNotToSay}
                    </SelectItem>
                    <SelectItem value="transgender">
                        {dict.commons.volunteers.create.gender.transgender}
                    </SelectItem>
                    <SelectItem value="gender-fluid">
                        {dict.commons.volunteers.create.gender.genderFluid}
                    </SelectItem>
                    <SelectItem value="agender">
                        {dict.commons.volunteers.create.gender.agender}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.volunteers.create.gender.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherGender"
                    type="text"
                    placeholder={dict.commons.volunteers.create.gender.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { Gender };
