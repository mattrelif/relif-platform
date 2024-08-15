"use client";

import { InputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/input.modal";
import { OutputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/output.modal";
import { RemoveModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/remove.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductSchema } from "@/types/product.types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaEdit, FaTrash } from "react-icons/fa";
import { FaBoxesPacking } from "react-icons/fa6";
import { IoMdMove } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

import { MoveProductModal } from "./move.modal";

type Props = ProductSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...product }: Props): ReactNode => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";
    const inventoryPath = pathname.split("/").slice(0, 5).join("/");

    const [modalRemoveOpenState, setModalRemoveOpenState] = useState<boolean>(false);
    const [modalInputOpenState, setModalInputOpenState] = useState<boolean>(false);
    const [modalOutputOpenState, setModalOutputOpenState] = useState<boolean>(false);
    const [modalMoveOpenState, setModalMoveOpenState] = useState<boolean>(false);

    const CATEGORIES = {
        foodAndBeverages: "Food and Beverages",
        personalCareAndBeauty: "Personal Care and Beauty",
        householdCleaning: "Household Cleaning",
        babyCareProducts: "Baby Care Products",
        petProducts: "Pet Products",
        pharmacyAndMedications: "Pharmacy and Medications",
    };

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{product.name}</span>
                <div className="flex items-center gap-2">
                    <span>
                        <Badge className="bg-slate-200 text-slate-900">{product.brand}</Badge>
                    </span>
                    <span>
                        <Badge>{product.unit_type.toUpperCase()}</Badge>
                    </span>
                </div>
                {/* <div className="w-full flex items-center gap-2 justify-between flex-wrap"> */}
                <span className="text-xs text-slate-400 font-regular mt-3 flex items-center gap-2">
                    <MdCategory />
                    {CATEGORIES[product.category as keyof typeof CATEGORIES]}
                </span>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-1">
                    <FaBoxesPacking className="mr-1" />
                    {/* {console.log(product.storage_records)} */}
                    {product.storage_records.length <= 0 && "Não há produto no estoque"}
                    {/* Presente em <strong className="underline">3</strong> estoques, somando{" "} */}
                    {/* <strong className="underline">138</strong> unidades */}
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
                        {/* <DropdownMenuItem> */}
                        {/*    <span className="w-full flex items-center gap-2"> */}
                        {/*        <FaBoxes /> View product */}
                        {/*    </span> */}
                        {/* </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                            <Link href={`${inventoryPath}/${product.id}/edit`}>
                                <span className="w-full flex items-center gap-2">
                                    <FaEdit /> Edit product
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalRemoveOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaTrash /> Delete product
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
                    Created at {formatDate(product.created_at, locale || "en")}
                </span>
            </div>

            <RemoveModal
                product={product}
                refreshList={refreshList}
                removeDialogOpenState={modalRemoveOpenState}
                setRemoveDialogOpenState={setModalRemoveOpenState}
            />

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
