import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div className="w-full grid grid-cols-5 gap-4 p-4 xl:flex xl:items-center xl:justify-center">
            <section className="w-full h-full flex flex-col justify-center items-center col-span-2">
                {children}
            </section>
            <section className="w-full h-[calc(100vh-2rem)] bg-relif-orange-100/10 rounded-lg sticky top-4 self-start col-span-3 xl:hidden"></section>
        </div>
    );
}
