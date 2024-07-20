import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FaSave } from "react-icons/fa";

type Props = {
    editUserSheetOpenState: boolean;
    setEditUserSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserEdit = ({ editUserSheetOpenState, setEditUserSheetOpenState }: Props): ReactNode => (
    <Sheet open={editUserSheetOpenState} onOpenChange={setEditUserSheetOpenState}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Edit user information</SheetTitle>
            </SheetHeader>
            <form className="flex flex-col pt-9">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            disabled
                            defaultValue="anthony.vii27@gmail.com"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="firstName">First name *</Label>
                        <Input id="firstName" name="firstName" type="text" defaultValue="Anthony" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="lastName">Last name *</Label>
                        <Input id="lastName" name="lastName" type="text" defaultValue="Vinicius" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="role">Role *</Label>
                        <Input
                            id="role"
                            name="role"
                            type="text"
                            defaultValue="Software Engineer"
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
                                defaultValue="+55"
                            />
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                defaultValue="21 975869797"
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

export { UserEdit };
