"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FaSave } from "react-icons/fa";

type Props = {
    user: UserSchema;
    refreshList: () => void;
    editUserSheetOpenState: boolean;
    setEditUserSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserEdit = ({
    user,
    refreshList,
    editUserSheetOpenState,
    setEditUserSheetOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
                firstName: string;
                lastName: string;
                role: string;
                platformRole: "ORG_ADMIN" | "ORG_MEMBER";
                countryCode: string;
                phone: string;
            } = Object.fromEntries(formData);

            // TODO: Remove country, password
            await updateUser(user.id, {
                first_name: data.firstName,
                last_name: data.lastName,
                email: user.email,
                phones: [`${data.countryCode}_${data.phone}`],
                preferences: user.preferences,
                role: data.role,
                platform_role: data.platformRole,
            });

            refreshList();

            toast({
                title: "Saved!",
                description: "The new data was saved successfully.",
                variant: "success",
            });

            setEditUserSheetOpenState(false);
        } catch {
            toast({
                title: "Error updating user data",
                description:
                    "There was an issue updating the user's information. Please check the data and try again. If the problem persists, contact support.",
                variant: "destructive",
            });
        }
    };

    return (
        <Sheet open={editUserSheetOpenState} onOpenChange={setEditUserSheetOpenState}>
            <SheetContent className="p-2">
                <SheetHeader className="p-4">
                    <SheetTitle>Edit user information</SheetTitle>
                </SheetHeader>
                <form
                    className="p-4 w-full h-[calc(100vh-75px)] flex flex-col overflow-x-hidden overflow-y-scroll border-[1px] border-slate-200 rounded-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled
                                defaultValue={user.email}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                defaultValue={user.first_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                defaultValue={user.last_name}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                name="role"
                                type="text"
                                required
                                defaultValue={user.role}
                                placeholder="e.g. Director of Human Resources"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="platformRole">Platform Role *</Label>
                            <Select defaultValue={user.platform_role} name="platformRole">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ORG_MEMBER">Member</SelectItem>
                                    <SelectItem value="ORG_ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="phone">Phone *</Label>
                            <div className="w-full flex gap-2">
                                <Input
                                    id="countryCode"
                                    name="countryCode"
                                    type="text"
                                    placeholder="e.g. +55"
                                    className="w-[30%]"
                                    defaultValue={user?.phones[0].split("_")[0]}
                                    required
                                />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    defaultValue={user?.phones[0].split("_")[1]}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <Button
                            type="submit"
                            variant="default"
                            className="mt-[43px] w-full flex items-center gap-1"
                        >
                            <FaSave />
                            Save
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export { UserEdit };
