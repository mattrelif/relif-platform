import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

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
                <h1 className="font-bold text-2xl text-slate-500">Set your new password</h1>
                <p className="text-base text-slate-400">Must be at least 8 characters</p>
            </div>

            <form className="flex flex-col gap-5">
                <div>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="confirm-password">Confirm password</Label>
                            <Input id="confirm-password" name="confirm-password" type="password" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <Button type="submit" variant="default" className="mt-[43px] w-full">
                            Reset password
                        </Button>
                        <Button variant="link" className="no-underline mt-[20px]" asChild>
                            <Link href="/" className="flex items-center gap-2">
                                <FaArrowLeftLong />
                                Back to log in
                            </Link>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
