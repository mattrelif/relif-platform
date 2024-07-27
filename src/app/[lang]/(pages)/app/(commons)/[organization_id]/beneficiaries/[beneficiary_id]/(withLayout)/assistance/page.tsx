import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { LuHelpingHand } from "react-icons/lu";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return (
        <div>
            <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500">
                <div className="flex flex-col">
                    <span className="text-white font-bold text-base pb-2 flex items-center gap-2">
                        <FaUsers size={15} />
                        John Doe Marks
                    </span>
                    <span className="text-xs text-slate-50 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        Abrigo Santo Agostino | Currently in space <strong>QUARTO-02</strong>
                    </span>
                </div>
            </div>
            <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4 mt-2">
                <h1 className="text-relif-orange-200 text-xl font-bold flex items-center gap-2 mb-4">
                    <LuHelpingHand size={28} />
                    Assistance received
                </h1>
                <ul className="flex flex-col gap-2">
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                    <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1">
                        <span className="text-sm text-slate-900 flex items-center gap-2">
                            July 24, 2024<Badge>4 itens</Badge>
                        </span>
                        <span></span>
                        <span className="text-sm text-slate-900">
                            <strong>From:</strong> Abrigo Santo Agostino
                        </span>
                        <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                            <FaCartPlus />
                            Itens
                        </span>
                        <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                            2x Pão de Forma 500g (Panco) | 1x Margarina 500g (Qualy) | 3x Leite UHT
                            ( Parmalat) | 1x Dúzia de Ovos (Indiferente)
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
