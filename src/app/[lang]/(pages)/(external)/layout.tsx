import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <main className="w-full grid grid-cols-2 gap-4 p-4">
            <section className="w-full h-full flex flex-col justify-center items-center">
                {children}
            </section>
            <section className="w-full h-[calc(100vh-2rem)] bg-relif-orange-100/10 rounded-lg sticky top-4 self-start"></section>
        </main>
    );
}
