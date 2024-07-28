"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { FaSave } from "react-icons/fa";

type Props = {
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const EditSpace = ({ sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    const { toast } = useToast();

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
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit space information</SheetTitle>
                </SheetHeader>
                <form className="flex flex-col pt-9" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" name="name" type="text" defaultValue="" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="beds">Beds</Label>
                            <Input
                                id="beds"
                                name="beds"
                                type="number"
                                min={1}
                                max={9999}
                                defaultValue={1}
                            />
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

export { EditSpace };
