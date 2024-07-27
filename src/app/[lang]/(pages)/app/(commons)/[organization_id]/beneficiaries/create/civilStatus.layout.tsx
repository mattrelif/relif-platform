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

const CivilStatus = (): ReactNode => {
    const [option, setOption] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="civilStatus">Civil Status</Label>
            <Select onValueChange={opt => setOption(opt)}>
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
                <Input name="other-civil-status" type="text" placeholder="Specify civil status" />
            )}
        </div>
    );
};

export { CivilStatus };
