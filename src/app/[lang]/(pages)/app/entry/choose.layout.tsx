import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

const Choose = (): ReactNode => {
    return (
        <div className="w-[700px] h-max border border-slate-200 rounded-lg">
            <h1 className="text-slate-900 font-bold text-xl flex items-center justify-center w-full border-b-[1px] border-slate-200 p-6">
                Welcome, Anthony!
            </h1>
            <div className="bg-slate-200 overflow-hidden grid grid-cols-2 gap-[1px]">
                <div className="w-full h-full bg-white p-6 flex flex-col gap-3">
                    <h2 className="text-slate-900 text-base font-semibold flex items-center gap-2">
                        <MdAdd size={20} /> Create an organization
                    </h2>
                    <Button asChild>
                        <Link href="/app/entry/create">I want to create a new organization</Link>
                    </Button>
                </div>
                <div className="w-full h-full bg-white p-6 flex flex-col gap-3">
                    <h2 className="text-slate-900 text-base font-semibold">Join an organization</h2>
                    <div className="flex items-end gap-2">
                        <div className="w-full flex flex-col gap-3">
                            <Input placeholder="Enter the organization token" />
                        </div>
                        <Button>Enter</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Choose };
