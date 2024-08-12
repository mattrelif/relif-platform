"use client";

import { InputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/input.modal";
import { OutputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/output.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaBoxes, FaEdit } from "react-icons/fa";
import { FaBoxesPacking } from "react-icons/fa6";
import { IoMdMove } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { MoveProductModal } from "./move.modal";

const Card = (): ReactNode => {
    const [modalInputOpenState, setModalInputOpenState] = useState<boolean>(false);
    const [modalOutputOpenState, setModalOutputOpenState] = useState<boolean>(false);
    const [modalMoveOpenState, setModalMoveOpenState] = useState<boolean>(false);

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">
                    Pacote de Fralda Pampers c/ 12 unidades
                </span>
                <div className="flex items-center gap-2">
                    <span>
                        <Badge className="bg-slate-200 text-slate-900">ref: P_FP_12</Badge>
                    </span>
                    <span>
                        <Badge>UN</Badge>
                    </span>
                </div>
                {/* <div className="w-full flex items-center gap-2 justify-between flex-wrap"> */}
                <span className="text-xs text-slate-400 font-regular mt-3 flex items-center gap-2">
                    <MdCategory />
                    Baby Care Products, Pharmacy and Medications
                </span>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-1">
                    <FaBoxesPacking className="mr-1" />
                    Presente em <strong className="underline">3</strong> estoques, somando{" "}
                    <strong className="underline">138</strong> unidades
                </span>
                {/* </div> */}
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <span className="w-full flex items-center gap-2">
                                <FaBoxes /> View product
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="w-full flex items-center gap-2">
                                <FaEdit /> Edit product
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setModalInputOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleRight /> Dar entrada no produto
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalOutputOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleLeft /> Dar baixa no produto
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalMoveOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <IoMdMove /> Mover para outro estoque
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-2">
                    Created at February 27, 2024
                </span>
            </div>

            <InputProductModal
                modalOpenState={modalInputOpenState}
                setModalOpenState={setModalInputOpenState}
            />

            <OutputProductModal
                modalOpenState={modalOutputOpenState}
                setModalOpenState={setModalOutputOpenState}
            />

            <MoveProductModal
                modalOpenState={modalMoveOpenState}
                setModalOpenState={setModalMoveOpenState}
            />
        </li>
    );
};

export { Card };
