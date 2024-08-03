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

const RelationshipDegree = (): ReactNode => {
    const [option, setOption] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="emergencyRelationship">Relationship Degree *</Label>
            <Select name="emergencyRelationship" onValueChange={setOption}>
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
                />
            )}
        </div>
    );
};

export { RelationshipDegree };
