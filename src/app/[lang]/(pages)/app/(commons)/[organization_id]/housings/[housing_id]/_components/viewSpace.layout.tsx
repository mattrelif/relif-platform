"use client";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FaUsers } from "react-icons/fa";
import { BeneficiaryCard } from "../beneficiaries/card.layout";

type Props = {
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const ViewSpace = ({ sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="py-4 px-4">
                <SheetHeader>
                    <SheetTitle>View space</SheetTitle>
                </SheetHeader>
                <div className="p-4 rounded-lg border border-relif-orange-200 border-dashed mt-4">
                    <h2 className="w-full text-relif-orange-200 text-xl font-bold flex items-center gap-2">
                        QUARTO-02 <Badge>Available</Badge>
                    </h2>
                    <span className="text-sm text-slate-900">32 beds, 7 available</span>
                </div>
                <h3 className="mt-8 text-slate-900 text-sm font-bold pb-2 flex items-center gap-2">
                    <FaUsers /> Beneficiaries present
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <ul className="w-full h-[calc(100vh-225px)] overflow-x-hidden overflow-y-scroll">
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                        <BeneficiaryCard type="current" />
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export { ViewSpace };
