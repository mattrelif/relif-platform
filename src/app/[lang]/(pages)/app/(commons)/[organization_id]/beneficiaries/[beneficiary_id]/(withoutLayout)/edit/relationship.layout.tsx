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
    "parent",
    "child",
    "sibling",
    "spouse",
    "grandparent",
    "grandchild",
    "aunt-uncle",
    "niece-nephew",
    "cousin",
    "guardian",
];

const RelationshipDegree = ({ defaultValue }: Props): ReactNode => {
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
            <Label htmlFor="emergencyRelationship">Relationship Degree *</Label>
            <Select name="emergencyRelationship" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="emergencyRelationship">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="grandchild">Grandchild</SelectItem>
                    <SelectItem value="aunt-uncle">Aunt/Uncle</SelectItem>
                    <SelectItem value="niece-nephew">Niece/Nephew</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEmergencyRelationship"
                    type="text"
                    placeholder="Specify relationship"
                    value={customOption}
                    onChange={e => setCustomOption(e.target.value)}
                />
            )}
        </div>
    );
};

export { RelationshipDegree };
