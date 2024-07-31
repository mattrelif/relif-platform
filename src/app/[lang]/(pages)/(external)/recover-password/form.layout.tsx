"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updatePassword } from "@/repository/password.repository";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const Form = (): ReactNode => {
    const params = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const code = params.get("code");
            if (!code) {
                throw new Error();
            }

            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                password: string;
                confirmPassword: string;
            } = Object.fromEntries(formData);

            if (data.password !== data.confirmPassword) {
                toast({
                    title: "Registration Error",
                    description: "Passwords do not match.",
                    variant: "destructive",
                });
                return;
            }

            await updatePassword(code, data.password);

            toast({
                title: "Password Changed",
                description: "Your password has been successfully updated.",
            });

            setTimeout(() => router.push("/"), 1000);
        } catch (err) {
            toast({
                title: "Password Change Failed",
                description: "There was an error changing your password. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            minLength={6}
                            required
                        />
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
    );
};

export { Form };
