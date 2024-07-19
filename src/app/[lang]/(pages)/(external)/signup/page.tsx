import { Form } from "@/app/[lang]/(pages)/(external)/signup/form.layout";
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
                <h1 className="font-bold text-3xl text-slate-900">Create account</h1>
                <p className="text-base text-slate-600">We'd love to have you!</p>
            </div>

            <Form />
        </div>
    );
}
