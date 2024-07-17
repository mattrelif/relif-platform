import { ReactNode } from "react";

export default function Page({
    params,
}: {
    params: {
        housing_id: string;
    };
}): ReactNode {
    return (
        <div>
            <h2>Housing {params.housing_id} - Spaces</h2>
        </div>
    );
}
