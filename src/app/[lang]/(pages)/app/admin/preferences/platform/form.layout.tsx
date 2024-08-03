"use client";

import { TIMEZONES } from "@/app/constants/timezones";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";

const Form = (): ReactNode => {
    const [userData, setUserData] = useState<UserSchema | null>(null);
    const [language, setLanguage] = useState("english");
    const [timezone, setTimezone] = useState("UTC+00");

    useEffect(() => {
        const ud: UserSchema = getFromLocalStorage("r_ud");
        setUserData(ud);
        setLanguage(ud.preferences.language);
        setLanguage(ud.preferences.timezone);
    }, []);

    const handleLanguage = async (newLanguage: string): Promise<void> => {
        setLanguage(newLanguage);

        if (userData) {
            await updateUser(userData.id, {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                phones: userData.phones,
                // TODO: Remove country e password
                country: userData.country,
                password: userData.password,
                preferences: { language: newLanguage, timezone: userData.preferences.timezone },
            });
        }
    };

    const handleTimezone = async (newTimezone: string): Promise<void> => {
        setTimezone(newTimezone);

        if (userData) {
            await updateUser(userData.id, {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                phones: userData.phones,
                // TODO: Remove country e password
                country: userData.country,
                password: userData.password,
                preferences: { language: userData.preferences.language, timezone: newTimezone },
            });
        }
    };

    return (
        <>
            <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4">
                <span className="text-sm text-slate-900 font-semibold">Language</span>
                <Select defaultValue={language} onValueChange={handleLanguage}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4">
                <span className="text-sm text-slate-900 font-semibold">Timezone</span>
                <Select defaultValue={timezone} onValueChange={handleTimezone}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TIMEZONES.map(tz => (
                            <SelectItem
                                key={tz.timezone}
                                value={tz.timezone}
                            >{`${tz.timezone} | ${tz.name}`}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
};

export { Form };
