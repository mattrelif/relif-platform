import { ReactNode } from "react";

import { CaseList } from "./_components/list.layout";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4 lg:p-2">
            <CaseList />
        </div>
    );
}
