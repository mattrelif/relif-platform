import { SignInForm } from "@/app/[lang]/(pages)/(external)/form.layout";
import Image from "next/image";
import { ReactNode } from "react";

export default function Page(): ReactNode {
    return (
        <div className="w-full max-w-[500px] py-[90px]">
            <div className="flex flex-col mb-10">
                <Image
                    src="/images/logo-relif.svg"
                    alt="Logo Relif"
                    width={188}
                    height={62}
                    className="mb-[80px]"
                />
                <h1 className="font-bold text-2xl text-slate-700">Get Started Now</h1>
                <p className="text-base text-slate-400">
                    Enter your credentials to access our account
                </p>
            </div>

            <SignInForm />
        </div>
    );
}
