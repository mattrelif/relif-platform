"use client";

import { Button } from "@/components/ui/button";
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
import { FaGlobe } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

type LanguageInputProps = {
    id: number;
    onRemove: (id: number) => void;
};

const LanguageInput = ({ id, onRemove }: LanguageInputProps) => {
    const [option, setOption] = useState("");

    return (
        <div key={id} className="flex items-center gap-2">
            <Select onValueChange={opt => setOption(opt)}>
                <SelectTrigger className="w-full" id={`language_${id}`}>
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name={`other-language-${id}`}
                    type="text"
                    placeholder="Specify language"
                    required
                />
            )}
            <Button variant="ghost" onClick={() => onRemove(id)}>
                Remove
            </Button>
        </div>
    );
};

const Languages = () => {
    const [inputs, setInputs] = useState<{ id: number; component: ReactNode }[]>([]);

    const addLanguageInput = () => {
        const newId = inputs.length + 1;
        setInputs(prevInputs => [
            ...prevInputs,
            {
                id: newId,
                component: <LanguageInput key={newId} id={newId} onRemove={removeInput} />,
            },
        ]);
    };

    const removeInput = (id: number) => {
        setInputs(prevInputs => prevInputs.filter(input => input.id !== id));
    };

    return (
        <div className="flex flex-col gap-3 p-4 rounded-lg border border-slate-200">
            <div className="w-full flex flex-wrap items-center justify-between">
                <Label htmlFor="languages" className="flex items-center gap-2">
                    <FaGlobe /> Languages spoken
                </Label>
                <Button
                    variant="secondary"
                    onClick={addLanguageInput}
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <MdAdd size={16} />
                    Add new language
                </Button>
            </div>
            {inputs.map(input => input.component)}
        </div>
    );
};

export { Languages };
