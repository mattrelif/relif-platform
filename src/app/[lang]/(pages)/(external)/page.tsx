import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";

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
                <h1 className="font-bold text-2xl text-slate-500">Get Started Now</h1>
                <p className="text-base text-slate-400">
                    Enter your credentials to access our account
                </p>
            </div>

            <form className="flex flex-col gap-5">
                <div>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" name="email" type="email" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button variant="link" className="p-0 h-max no-underline" asChild>
                                    <Link href="/forgot-password">Forgot password?</Link>
                                </Button>
                            </div>
                            <Input id="password" name="password" type="password" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <Button type="submit" variant="default" className="mt-[43px] w-full">
                            Sign in
                        </Button>
                        <span className="text-sm text-gray-500">
                            Need an account?
                            <Button variant="link" asChild>
                                <Link href="/signup">Sign up here</Link>
                            </Button>
                        </span>
                    </div>
                </div>
                <div className="w-full relative flex justify-center mb-[17px]">
                    <span className="w-full border-b-[1px] border-slate-200 absolute top-[10px]" />
                    <span className="w-max text-sm text-gray-500 flex justify-center px-[10px] bg-white z-10">
                        or
                    </span>
                </div>
                <Button variant="outline" className="w-full flex items-center gap-3">
                    <FcGoogle size={18} />
                    Sign in with Google
                </Button>
            </form>
        </div>
    );
}
