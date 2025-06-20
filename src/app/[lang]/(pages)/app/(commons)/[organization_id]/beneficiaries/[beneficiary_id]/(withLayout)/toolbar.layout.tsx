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
        <TooltipProvider>
            <div className="w-full h-max flex items-center justify-end gap-2 p-2">
                {platformRole === "ORG_ADMIN" && (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setStatusDialogOpenState(true)}
                                >
                                    <FaUserCheck className="w-3 h-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Change Status</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`${beneficiaryPath}/edit`}>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <FaEdit className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.editBeneficiaryTooltip}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setMoveDialogOpenState(true)}
                                >
                                    <IoMdMove className="w-3 h-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.moveBeneficiaryTooltip}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setRemoveDialogOpenState(true)}
                                >
                                    <FaTrash className="w-3 h-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.commons.beneficiaries.beneficiaryId.toolbar.removeBeneficiaryTooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                )}
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
        </TooltipProvider>
    );
};

export { Toolbar };
