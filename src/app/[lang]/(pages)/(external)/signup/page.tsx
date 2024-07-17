import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
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
                <h1 className="font-bold text-3xl text-slate-500">Create account</h1>
                <p className="text-base text-slate-400">We'd love to have you!</p>
            </div>

            <form>
                <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-medium text-sm text-relif-orange-200 mb-6">
                    Your personal data
                </h2>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="firstName">First name *</Label>
                        <Input id="firstName" name="firstName" type="text" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="lastName">Last name *</Label>
                        <Input id="lastName" name="lastName" type="text" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="role">Role *</Label>
                        <Input
                            id="role"
                            name="role"
                            type="text"
                            placeholder="e.g. Director of Human Resources"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="phone">Phones *</Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="country-code"
                                name="country-code"
                                type="text"
                                placeholder="e.g. +55"
                                className="w-[30%]"
                            />
                            <Input id="phone" name="phone" type="text" />
                        </div>
                    </div>
                </div>

                <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-medium text-sm text-relif-orange-200 mt-10 mb-6">
                    Your credentials
                </h2>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" name="email" type="email" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="password">Password *</Label>
                        <Input id="password" name="password" type="password" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="confirmPassword">Confirm password *</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center">
                    <Button type="submit" variant="default" className="mt-[43px] w-full">
                        Sign up
                    </Button>
                    <span className="text-sm text-gray-500">
                        Already have an account?
                        <Button variant="link" asChild>
                            <Link href="/">Log in</Link>
                        </Button>
                    </span>
                </div>
            </form>
        </div>
    );
}
