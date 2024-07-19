"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FormEvent, ReactNode } from "react";

const Form = (): ReactNode => {
    const { toast } = useToast();

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();

        toast({
            title: "Invalid entered data",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            variant: "destructive",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
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

                <div className="items-top flex space-x-2">
                    <Checkbox id="terms" />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms"
                            className="text-sm text-slate-900 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                        <p className="text-sm text-slate-600">
                            You agree to our{" "}
                            <Link
                                href="/terms-of-service"
                                className="underline hover:text-relif-orange-200 underline-offset-4"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy-policy"
                                className="underline hover:text-relif-orange-200 underline-offset-4"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center">
                <Button type="submit" variant="default" className="mt-[43px] w-full">
                    Sign up
                </Button>
                <span className="text-sm text-gray-900">
                    Already have an account?
                    <Button variant="link" asChild>
                        <Link href="/">Log in</Link>
                    </Button>
                </span>
            </div>
        </form>
    );
};

export { Form };
