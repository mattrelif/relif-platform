"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash, FaUserCheck } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";

import { MoveModal } from "../../_components/move.modal";
import { RemoveModal } from "../../_components/remove.modal";
import { StatusModal } from "../../_components/status.modal";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshData?: () => void;
};

const Toolbar = ({ beneficiary, refreshData }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const [moveDialogOpenState, setMoveDialogOpenState] = useState(false);
    const [statusDialogOpenState, setStatusDialogOpenState] = useState(false);

    const beneficiaryPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <>
            <div className="w-full h-max flex items-center justify-between gap-4 p-4 lg:p-2">
                <div className="flex items-center gap-2">
                    {platformRole === "ORG_ADMIN" && (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setStatusDialogOpenState(true)}
                                        >
                                            <FaUserCheck className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Change Status</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={`${beneficiaryPath}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <FaEdit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.editBeneficiary}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMoveDialogOpenState(true)}
                                        >
                                            <IoMdMove className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.moveBeneficiary}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRemoveDialogOpenState(true)}
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.removeBeneficiary}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </div>
            </div>

            <RemoveModal
                beneficiary={beneficiary}
                refreshList={refreshData}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />

            <MoveModal
                beneficiary={beneficiary}
                refreshList={refreshData}
                moveDialogOpenState={moveDialogOpenState}
                setMoveDialogOpenState={setMoveDialogOpenState}
            />

            <StatusModal
                beneficiary={beneficiary}
                refreshList={refreshData}
                statusDialogOpenState={statusDialogOpenState}
                setStatusDialogOpenState={setStatusDialogOpenState}
            />
        </>
    );
};

export { Toolbar };
