"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

type Props = {
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

type SpaceInputProps = {
    id: number;
    removeInput: (id: number) => void;
};

const SpaceInput = ({ id, removeInput }: SpaceInputProps): ReactNode => {
    return (
        <li className="flex border border-slate-200 rounded-md items-end gap-2 p-2" key={id}>
            <div className="w-full flex flex-col gap-3">
                <Label htmlFor={`name_${id}`}>Name *</Label>
                <Input
                    id={`name_${id}`}
                    name={`name_${id}`}
                    type="text"
                    defaultValue=""
                    className="w-full"
                />
            </div>
            <div className="w-[80px] flex flex-col gap-3">
                <Label htmlFor={`beds_${id}`}>Beds *</Label>
                <Input
                    id={`beds_${id}`}
                    name={`beds_${id}`}
                    type="number"
                    min={1}
                    max={9999}
                    defaultValue={1}
                    className="w-[80px]"
                />
            </div>
            <Button variant="ghost" type="button" onClick={() => removeInput(id)}>
                Remove
            </Button>
        </li>
    );
};

const CreateSheet = ({ sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    const { toast } = useToast();
    const [inputs, setInputs] = useState<number[]>([]);

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
        //

        setSheetOpenState(false);
    };

    const addNewSpace = () => {
        setInputs(prevInputs => [...prevInputs, prevInputs.length + 1]);
    };

    const removeInput = (id: number) => {
        setInputs(prevInputs => prevInputs.filter(inputId => inputId !== id));
    };

    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="py-4 px-4">
                <SheetHeader>
                    <SheetTitle>Create space</SheetTitle>
                </SheetHeader>
                <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addNewSpace}
                        className="mt-5 mb-5 flex items-center gap-2"
                    >
                        <MdAdd size={16} />
                        Add new space
                    </Button>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <ul className="flex flex-col h-[calc(100vh-205px)] gap-2 overflow-x-hidden overflow-y-scroll p-2">
                            {inputs?.map(id => (
                                <SpaceInput key={id} id={id} removeInput={removeInput} />
                            ))}
                        </ul>
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-5 w-full flex items-center gap-1"
                    >
                        <FaSave />
                        Save
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

const CreateSpace = (): ReactNode => {
    const [sheetOpenState, setSheetOpenState] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setSheetOpenState(true)}
            >
                <MdAdd size={16} /> New
            </Button>

            <CreateSheet sheetOpenState={sheetOpenState} setSheetOpenState={setSheetOpenState} />
        </>
    );
};

export { CreateSpace };
