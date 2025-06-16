"use client";

import { ReactNode } from "react";

import { ProductList } from "./_components/list.layout";
import { Toolbar } from "./_components/toolbar.layout";

export default function Page({ params }: { params: { organization_id: string } }): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4 lg:p-2">
            <ProductList />
        </div>
    );
}
