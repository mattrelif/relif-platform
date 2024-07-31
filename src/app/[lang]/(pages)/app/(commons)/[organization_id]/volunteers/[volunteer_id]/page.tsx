import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { FaCity } from "react-icons/fa";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdContactEmergency } from "react-icons/md";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return (
        <div className="w-full h-max flex flex-col gap-2 p-2">
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-slate-900">John Doe Marks</h2>
                    <span className="text-sm text-slate-500 flex items-center gap-4">
                        Registered in February 14, 2023<Badge>Active</Badge>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <IoPerson />
                        Personal data
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Full name:</strong> John Doe Marks
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Birthdate:</strong> February 11, 1968 (24 years old)
                            <span>
                                <Badge className="bg-yellow-300 text-slate-900">Underage</Badge>
                            </span>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>E-mail:</strong> john.doe@gmail.com
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Gender:</strong> Men
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap gap-2">
                            <strong>Phones:</strong>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to copy to clipboard</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                            <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Badge className="bg-relif-orange-400 hover:bg-relif-orange-500">
                                        +2
                                    </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                    <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Civil status:</strong> Single
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Languages spoken:</strong>{" "}
                            <Badge className="bg-relif-orange-500">Portuguese</Badge>
                            <Badge className="bg-relif-orange-500">English</Badge>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Education:</strong> Graduation
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Occupation:</strong> Bus driver
                        </li>
                    </ul>
                </div>
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaCity />
                        Address
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Address:</strong> Rua de Exemplo, 450 - Bloco 12, Apto 405
                        </li>
                        <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>City:</strong> São Paulo
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>State / Province:</strong> São Paulo
                            </li>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Zip / Postal Code:</strong> 12345-123
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Country:</strong> Brazil
                            </li>
                        </div>
                    </ul>
                    <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4 flex items-center gap-2">
                        <MdContactEmergency />
                        Emergency Contacts
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Family:</strong> Yes
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Email:</strong>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge className="cursor-pointer">example@gmail.com</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to copy to clipboard</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Badge className="bg-relif-orange-400 hover:bg-relif-orange-500">
                                        +2
                                    </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <Badge className="cursor-pointer">example2@gmail.com</Badge>
                                    <Badge className="cursor-pointer">example3@gmail.com</Badge>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Phones:</strong>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to copy to clipboard</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Badge className="bg-relif-orange-400 hover:bg-relif-orange-500">
                                        +1
                                    </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                    <FaBriefcaseMedical />
                    Medical information
                </h3>
                <div>
                    <ul className="w-full grid grid-cols-2">
                        <div>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Allergies:</strong> Alergia a penicilina
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Current medications:</strong> Losartana, Inalador de
                                Salbutamol
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Chronic Medical Conditions:</strong> Hipertensão, Asma
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Health Insurance:</strong> Amil, Plano Gold
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Blood Type:</strong> O+
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Vaccinations:</strong> Hepatite B, Gripe, COVID-19
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Mental Health:</strong> Histórico de ansiedade, em
                                tratamento com psicólogo
                            </li>
                        </div>
                        <div>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Height:</strong> 170cm
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Weight:</strong> 70kg
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Smoking and Alcohol Consumption Habits:</strong> Não fuma,
                                consumo social de álcool
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Disabilities:</strong> Deficiência auditiva, uso de aparelho
                                auditivo
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Use of prosthesics or medical devices:</strong> Uso de
                                marca-passo
                            </li>
                            <Button variant="link" className="p-0 pl-2">
                                See more
                            </Button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}
