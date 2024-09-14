"use client";

import { InputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/input.modal";
import { OutputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/output.modal";
import { RemoveModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/remove.modal";
import { useDictionary } from "@/app/context/dictionaryContext";
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
    const dict = useDictionary();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";
    const inventoryPath = pathname.split("/").slice(0, 5).join("/");

    const [modalRemoveOpenState, setModalRemoveOpenState] = useState<boolean>(false);
    const [modalInputOpenState, setModalInputOpenState] = useState<boolean>(false);
    const [modalOutputOpenState, setModalOutputOpenState] = useState<boolean>(false);
    const [modalMoveOpenState, setModalMoveOpenState] = useState<boolean>(false);

    const CATEGORIES = {
        foodAndBeverages: dict.commons.inventory.card.foodAndBeverages,
        personalCareAndBeauty: dict.commons.inventory.card.personalCareAndBeauty,
        householdCleaning: dict.commons.inventory.card.householdCleaning,
        babyCareProducts: dict.commons.inventory.card.babyCareProducts,
        petProducts: dict.commons.inventory.card.petProducts,
        pharmacyAndMedications: dict.commons.inventory.card.pharmacyAndMedications,
    };

    const quantity =
        product?.storage_records.reduce((acc, record) => acc + record.quantity, 0) || 0;

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4">
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
                <span className="text-xs text-slate-400 font-regular mt-3 flex items-center gap-2">
                    <MdCategory />
                    {CATEGORIES[product.category as keyof typeof CATEGORIES]}
                </span>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-1">
                    <FaBoxesPacking className="mr-1" />
                    <span>
                        {product.storage_records.length <= 0 ? (
                            dict.commons.inventory.card.noProductInStock
                        ) : (
                            <>
                                {dict.commons.inventory.card.presentIn}{" "}
                                <strong className="text-relif-orange-200">
                                    {product.storage_records.length}
                                </strong>{" "}
                                {dict.commons.inventory.card.stock}{" "}
                                <strong className="text-relif-orange-200">{quantity}</strong>{" "}
                                {dict.commons.inventory.card.units}{" "}
                            </>
                        )}
                    </span>
                </span>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${inventoryPath}/${product.id}/edit`}>
                                <span className="w-full flex items-center gap-2">
                                    <FaEdit /> {dict.commons.inventory.card.editProduct}
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalRemoveOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaTrash /> {dict.commons.inventory.card.deleteProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setModalInputOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleLeft /> {dict.commons.inventory.card.inputProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={product.storage_records.length <= 0}
                            onClick={() => setModalOutputOpenState(true)}
                        >
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleRight /> {dict.commons.inventory.card.outputProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={product.storage_records.length <= 0}
                            onClick={() => setModalMoveOpenState(true)}
                        >
                            <span className="w-full flex items-center gap-2">
                                <IoMdMove /> {dict.commons.inventory.card.moveProduct}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-2 lg:hidden">
                    {dict.commons.inventory.card.createdAt}{" "}
                    {formatDate(product.created_at, locale || "en")}
                </span>
            </div>

            <RemoveModal
                product={product}
                refreshList={refreshList}
                removeDialogOpenState={modalRemoveOpenState}
                setRemoveDialogOpenState={setModalRemoveOpenState}
            />

            <InputProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalInputOpenState}
                setModalOpenState={setModalInputOpenState}
            />

            <OutputProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalOutputOpenState}
                setModalOpenState={setModalOutputOpenState}
            />

            <MoveProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalMoveOpenState}
                setModalOpenState={setModalMoveOpenState}
            />
        </li>
    );
};

export { Card };
