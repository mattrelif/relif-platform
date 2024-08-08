"use client";

import { StorageList } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/storageList.layout";
import { ReactNode } from "react";

import { Toolbar } from "./_components/toolbar.layout";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-end gap-4 justify-between">
                <Toolbar />
            </div>
            <div className="w-full grid grid-cols-[400px_auto] gap-4">
                <StorageList />
            </div>
        </div>
    );
}
