import { ReactNode } from "react";

export default function Page({
    params,
}: {
    params: {
        organization_id: string;
    };
}): ReactNode {
    return (
        <div>
            <h2>Volunteers {params.organization_id}</h2>
            Dashboard
        </div>
    );
}
