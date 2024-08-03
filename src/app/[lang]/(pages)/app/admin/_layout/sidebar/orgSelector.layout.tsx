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
import { findAllOrganizations } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { Check, ChevronsUpDown } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const OrgSelector = (): ReactNode => {
    const [orgs, setOrgs] = useState<{ count: number; data: OrganizationSchema[] } | null>(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("org1");

    useEffect(() => {
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");
                const currentOrganization = currentUser.organization_id;

                const OFFSET = 0;
                const LIMIT = 9999;
                // TODO: ALTERAR ENDPOINT P/ APENAS AQUELES QUE TEM ACESSO
                const { data: organizations } = await findAllOrganizations(OFFSET, LIMIT);
                setOrgs(organizations);
                setValue(currentOrganization ?? "");
            } catch {}
        })();
    }, []);

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
                        ? orgs?.data.find(org => org.id === value)?.name
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
                            {orgs?.data?.map(org => (
                                <CommandItem
                                    key={org.id}
                                    value={org.id}
                                    onSelect={currentValue => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === org.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {org.name}
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
