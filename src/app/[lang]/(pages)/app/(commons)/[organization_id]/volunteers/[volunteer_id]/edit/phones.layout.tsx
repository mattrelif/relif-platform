"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useState } from "react";
import { MdAdd, MdPhone } from "react-icons/md";

type PhoneInputProps = {
    id: number;
    onRemove: (id: number) => void;
};

const PhoneInput = ({ id, onRemove }: PhoneInputProps) => {
    return (
        <div className="flex w-full items-center gap-2">
            <Input
                key={`countryCode_${id}`}
                id={`countryCode_${id}`}
                name={`countryCode_${id}`}
                type="text"
                placeholder="e.g. +55"
                className="w-[100px]"
            />

            <Input
                key={`phoneNumber_${id}`}
                id={`phoneNumber_${id}`}
                name={`phoneNumber_${id}`}
                type="text"
                placeholder="e.g. 99 99999-9999"
            />

            <Button variant="ghost" onClick={() => onRemove(id)}>
                Remove
            </Button>
        </div>
    );
};

const Phones = (): ReactNode => {
    const [inputs, setInputs] = useState<{ id: number; component: ReactNode }[]>([]);

    const removePhoneInput = (id: number) => {
        setInputs(prevInputs => prevInputs.filter(input => input.id !== id));
    };

    const addPhoneInput = () => {
        const newId = inputs.length + 1;
        setInputs(prevInputs => [
            ...prevInputs,
            {
                id: newId,
                component: <PhoneInput key={newId} id={newId} onRemove={removePhoneInput} />,
            },
        ]);
    };

    return (
        <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg">
            <div className="w-full flex flex-wrap items-center justify-between">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                    <MdPhone />
                    Phones
                </Label>
                <Button
                    variant="secondary"
                    onClick={addPhoneInput}
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <MdAdd size={16} />
                    Add new phone number
                </Button>
            </div>
            {inputs?.map(input => input.component)}
        </div>
    );
};

export { Phones };
