import { ReactNode } from "react";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return (
        <div>
            <h2>Beneficiary {params.beneficiary_id}</h2>
        </div>
    );
}
