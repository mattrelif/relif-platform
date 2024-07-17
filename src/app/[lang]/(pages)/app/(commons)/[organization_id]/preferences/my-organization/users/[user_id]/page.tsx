import { ReactNode } from "react";

export default function Page({
    params,
}: {
    params: {
        user_id: string;
    };
}): ReactNode {
    return (
        <div>
            <h2>User {params.user_id}</h2>
        </div>
    );
}
