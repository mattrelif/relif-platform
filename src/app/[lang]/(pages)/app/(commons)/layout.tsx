import { Header } from "@/app/[lang]/(pages)/app/(commons)/_layout/header";
import { Sidebar } from "@/app/[lang]/(pages)/app/(commons)/_layout/sidebar";
import { DictionaryProvider } from "@/app/context/dictionaryContext";
import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { ReactNode } from "react";

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode;
    params: { lang: Locale };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <DictionaryProvider dict={dict}>
            <div className="w-full min-h-screen p-4 bg-slate-50 grid grid-cols-[250px_1fr]">
                <Sidebar />
                <div className="rounded-lg bg-white min-h-[calc(100vh-32px)] border-[1px] border-slate-300">
                    <Header />
                    <div className="col-span-1">{children}</div>
                </div>
            </div>
        </DictionaryProvider>
    );
}
