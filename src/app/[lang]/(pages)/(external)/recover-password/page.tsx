import Image from "next/image";
import { ReactNode } from "react";
import { Form } from "./form.layout";

export default function Page(): ReactNode {
    return (
        <div className="w-full max-w-[500px] py-[90px]">
            <div className="flex flex-col mb-10">
                <Image
                    src="/images/logo-relif.svg"
                    alt="Logo Relif"
                    width={188}
                    height={62}
                    className="mb-[40px]"
                />
                <h1 className="font-bold text-2xl text-slate-900">Set your new password</h1>
                <p className="text-base text-slate-600">Must be at least 8 characters</p>
            </div>

            <Form />
        </div>
    );
}
