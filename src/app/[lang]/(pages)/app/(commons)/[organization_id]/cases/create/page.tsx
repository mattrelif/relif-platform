"use client";

import { ReactNode } from "react";
import { CreateCaseForm } from "./_components/form.layout";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4 lg:p-2">
            <div className="w-full flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Create Case</h1>
                <CreateCaseForm />
            </div>
        </div>
    );
}
