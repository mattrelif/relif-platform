"use client";

import { ReactNode } from "react";

import { ProductList } from "./_components/list.layout";
import { Toolbar } from "./_components/toolbar.layout";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-end gap-4 justify-between">
                <Toolbar />
            </div>
            <div className="w-full">
                <ProductList />
            </div>
        </div>
    );
}
