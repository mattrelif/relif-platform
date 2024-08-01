"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getMe, signIn } from "@/repository/auth.repository";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const SignInForm = (): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
                password: string;
            } = Object.fromEntries(formData);

            await signIn(data.email, data.password);

            const { data: responseData } = await getMe();

            if (!responseData.organization_id) {
                router.push("/app/entry");
                return;
            }

            router.push(`/app/${responseData.organization_id}`);
        } catch {
            setIsLoading(false);
            toast({
                title: "Invalid credentials",
                description:
                    "The email address or password you entered is incorrect. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Button variant="link" className="p-0 h-max no-underline" asChild>
                                <Link href="/forgot-password">Forgot password?</Link>
                            </Button>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center">
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-[43px] w-full"
                        disabled={isLoading}
                    >
                        {!isLoading ? "Sign in" : "Loading..."}
                    </Button>
                    <span className="text-sm text-slate-900">
                        Need an account?
                        <Button variant="link" asChild>
                            <Link href="/signup">Sign up here</Link>
                        </Button>
                    </span>
                </div>
            </div>
            {/* <div className="w-full relative flex justify-center mb-[17px]">
                <span className="w-full border-b-[1px] border-slate-200 absolute top-[10px]" />
                <span className="w-max text-sm text-slate-900 flex justify-center px-[10px] bg-white z-10">
                    or
                </span>
            </div>
            <Button variant="outline" className="w-full flex items-center gap-3">
                <FcGoogle size={18} />
                Sign in with Google
            </Button> */}
        </form>
    );
};

export { SignInForm };
