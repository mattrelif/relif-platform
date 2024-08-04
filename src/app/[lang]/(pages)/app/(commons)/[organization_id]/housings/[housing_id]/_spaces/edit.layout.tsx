"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { updateSpace } from "@/repository/spaces.repository";
import { SpaceSchema } from "@/types/space.types";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaSave } from "react-icons/fa";

type Props = {
    space: SpaceSchema;
    refreshList: () => void;
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const EditSpace = ({ space, refreshList, sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                name: string;
                beds: number;
            } = Object.fromEntries(formData);

            await updateSpace(space.id, {
                name: data.name,
                total_vacancies: data.beds,
            });
            refreshList();

            toast({
                title: "Saved!",
                description: "The space data was updated successfully.",
                variant: "success",
            });
            setIsLoading(false);
        } catch {
            setIsLoading(false);
            toast({
                title: "Update Failed",
                description:
                    "An error occurred while trying to save the data. Please check the input and try again.",
                variant: "destructive",
            });
        }
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
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                defaultValue={space.name}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="beds">Beds *</Label>
                            <Input
                                id="beds"
                                name="beds"
                                type="number"
                                min={1}
                                max={9999}
                                defaultValue={space.total_vacancies}
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
                            {!isLoading ? "Save" : "Loading..."}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export { EditSpace };
