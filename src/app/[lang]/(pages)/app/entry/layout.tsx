import { Header } from "@/app/[lang]/(pages)/app/(commons)/_layout/header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div className="w-full min-h-screen p-4 bg-slate-50">
            <div className="rounded-lg bg-white min-h-[calc(100vh-32px)] border-[1px] border-slate-300 p-2">
                <Header />
                <div className="col-span-1">{children}</div>
            </div>
        </div>
    );
}
