"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { ReactNode, useState } from "react";

const organizations = [
    {
        value: "org1",
        label: "Organization 1",
    },
    {
        value: "org2",
        label: "Organization 2",
    },
    {
        value: "org3",
        label: "Organization 3",
    },
    {
        value: "org4",
        label: "Organization 4",
    },
    {
        value: "org5",
        label: "Organization 5",
    },
];

const OrgSelector = (): ReactNode => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("org1");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="icon"
                    role="combobox"
                    aria-expanded={open}
                    className="h-[40px] w-full justify-between "
                >
                    {value
                        ? organizations.find(organization => organization.value === value)?.label
                        : "Select organization..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search organization..." />
                    <CommandEmpty>No organization found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {organizations.map(organization => (
                                <CommandItem
                                    key={organization.value}
                                    value={organization.value}
                                    onSelect={currentValue => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === organization.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {organization.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export { OrgSelector };
