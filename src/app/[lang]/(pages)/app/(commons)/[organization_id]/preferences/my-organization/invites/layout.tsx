import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div>
            <h1>My organization - Invites</h1>
            {children}
        </div>
    );
}
