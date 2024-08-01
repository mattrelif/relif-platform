"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError, MdSave } from "react-icons/md";
import { Phones } from "./phones.layout";

const Form = (): ReactNode => {
    const { toast } = useToast();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        try {
            const ud: UserSchema = getFromLocalStorage("r_ud");
            setCurrentUser(ud);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                firstName: string;
                lastName: string;
                role: string;
            } = Object.fromEntries(formData);

            if (currentUser) {
                // TO DO: REMOVER COUNTRY, PASSWORD E ACERTAR PHONES
                await updateUser(currentUser.id, {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role: data.role,
                    email: currentUser?.email,
                    country: "Brasil",
                    password: "",
                    phones: currentUser?.phones,
                    preferences: currentUser?.preferences,
                });

                toast({
                    title: "Saved!",
                    description: "The new data was saved successfully.",
                    variant: "success",
                });
            } else {
                throw new Error();
            }
        } catch {
            toast({
                title: "Invalid entered data",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {isLoading && (
                <h2 className="p-2 text-relif-orange-400 text-sm font-medium">Loading...</h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <MdError />
                    Something went wrong. Please try again later.
                </span>
            )}

            {!isLoading && !error && (
                <form onSubmit={handleSubmit}>
                    <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-bold text-base text-relif-orange-200 mb-6">
                        Your profile
                    </h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                disabled
                                required
                                defaultValue={currentUser?.email}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                defaultValue={currentUser?.first_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                defaultValue={currentUser?.last_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                name="role"
                                type="text"
                                required
                                defaultValue={currentUser?.role}
                                placeholder="e.g. Director of Human Resources"
                            />
                        </div>

                        <Phones />
                    </div>

                    <Button
                        type="submit"
                        variant="default"
                        className="mt-[43px] w-full flex items-center gap-1"
                        disabled={isLoading}
                    >
                        <MdSave size={14} />
                        Save
                    </Button>
                </form>
            )}
        </>
    );
};

export { Form };
