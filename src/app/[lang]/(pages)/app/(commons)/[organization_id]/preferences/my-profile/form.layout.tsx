"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { MdAdd, MdClose, MdSave } from "react-icons/md";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserSchema | null>(null);
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const ud: UserSchema = getFromLocalStorage("r_ud");
        setUserData(ud);
        // setPhones(ud.phones);
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();

        toast({
            title: "Saved!",
            description: "The new data was saved successfully.",
            variant: "success",
        });

        // toast({
        //     title: "Invalid entered data",
        //     description:
        //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        //     variant: "destructive",
        // });
    };

    return (
        <>
            {!isLoading && (
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
                                defaultValue={userData?.email}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                defaultValue={userData?.first_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                defaultValue={userData?.last_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                name="role"
                                type="text"
                                defaultValue={userData?.role}
                                placeholder="e.g. Director of Human Resources"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="phone">Phones *</Label>
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <MdAdd size={16} />
                                    Add new phone number
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="w-full flex gap-2">
                                    <Input
                                        id="country-code"
                                        name="country-code"
                                        type="text"
                                        placeholder="e.g. +55"
                                        className="w-[20%]"
                                    />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        className="w-[calc(100%-20%-40px)]"
                                    />
                                    <Button variant="destructive" className="flex p-0 w-[40px]">
                                        <MdClose size={16} />
                                    </Button>
                                </div>
                                <div className="w-full flex gap-2">
                                    <Input
                                        id="country-code"
                                        name="country-code"
                                        type="text"
                                        placeholder="e.g. +55"
                                        className="w-[20%]"
                                    />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        className="w-[calc(100%-20%-40px)]"
                                    />
                                    <Button variant="destructive" className="flex p-0 w-[40px]">
                                        <MdClose size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
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
