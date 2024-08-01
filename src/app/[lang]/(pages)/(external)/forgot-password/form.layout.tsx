"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { requestChange } from "@/repository/password.repository";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
            } = Object.fromEntries(formData);

            await requestChange(data.email);

            setIsLoading(false);
            toast({
                title: "Password reset requested",
                description:
                    "A password reset link has been sent to your email. Please check your inbox.",
            });
        } catch (err) {
            setIsLoading(false);
            toast({
                title: "Password reset failed",
                description:
                    "There was an error requesting the password reset. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your e-mail"
                    />
                </div>
                <div className="w-full flex flex-col items-center">
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-[43px] w-full"
                        disabled={isLoading}
                    >
                        {!isLoading ? "Reset password" : "Loading..."}
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
