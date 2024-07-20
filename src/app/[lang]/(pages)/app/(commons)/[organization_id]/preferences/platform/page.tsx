import { TIMEZONES } from "@/app/constants/timezones";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";

export default function Page(): ReactNode {
    const LANGUAGE = "english";
    const TIMEZONE = "UTC-03";

    return (
        <div className="flex flex-col">
            <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4">
                <span className="text-sm text-slate-900 font-semibold">Language</span>
                <Select defaultValue={LANGUAGE}>
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
                <Select defaultValue={TIMEZONE}>
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
        </div>
    );
}
