import type { Metadata } from "next";
import "../globals.css";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Locale } from "@/app/i18n-config";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: {
        template: "%s | Relif",
        default: "Relif",
    },
};

export async function generateStaticParams(): Promise<{ lang: string }[]> {
    return [{ lang: "en-US" }, { lang: "nl" }];
}

export default function RootLayout({
    children,
    params,
}: Readonly<{
    children: ReactNode;
    params: { lang: Locale };
}>): ReactNode {
    return (
        <html lang={params.lang}>
            <body className={cn("min-h-screen bg-white font-sans antialiased", fontSans.variable)}>
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
