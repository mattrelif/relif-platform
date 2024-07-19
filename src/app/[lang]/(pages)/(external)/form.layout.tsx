"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FormEvent, ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";

const SignInForm = (): ReactNode => {
    const { toast } = useToast();

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();

        toast({
            title: "Invalid credentials",
            description:
                "The email address or password you entered is incorrect. Please try again.",
            variant: "destructive",
        });
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
    );
};

export { SignInForm };
