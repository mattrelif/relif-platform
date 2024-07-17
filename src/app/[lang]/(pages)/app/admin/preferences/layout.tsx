import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div>
            <h1>Preferences - Relif</h1>
            {children}
        </div>
    );
}
