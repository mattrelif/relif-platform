import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaMapMarkerAlt, FaCity, FaBirthdayCake } from "react-icons/fa";
import { FaHouseChimneyUser, FaBriefcaseMedical } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdContactEmergency, MdOutlineFamilyRestroom, MdSpaceDashboard } from "react-icons/md";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return (
        <div className="w-full h-max flex flex-col gap-2">
            {/* <h2>Beneficiary {params.beneficiary_id}</h2> */}
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                <div className="w-full h-max flex justify-between items-center">
                    <Button size="sm" variant="secondary">
                        Back to list
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="default">
                            Edit
                        </Button>
                        <Button size="sm" variant="outline">
                            Remove
                        </Button>
                    </div>
                </div>
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-4 border-relif-orange-200">
                    {/* <Image */}
                    {/*    src="https://github.com/anthonyvii27.png" */}
                    {/*    alt="Beneficiary image" */}
                    {/*    width={130} */}
                    {/*    height={130} */}
                    {/*    className="border-2 rounded-full border-white" */}
                    {/* /> */}
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-slate-900">John Doe Marks</h2>
                    <span className="text-sm text-slate-500 flex items-center gap-4">
                        Registered in February 14, 2023<Badge>Active</Badge>
                    </span>
                </div>
            </div>
            <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500 flex justify-between">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-base pb-2 flex items-center gap-2">
                        {" "}
                        <FaHouseChimneyUser size={15} />
                        Current housing
                    </h3>
                    <span className="text-xs text-slate-50 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        Abrigo Santo Agostino | Currently in space <strong>QUARTO-02</strong> with 2
                        members of your family.
                    </span>
                    <span className="text-xs text-slate-50 flex items-center gap-1">
                        Since Mar 04, 2023
                    </span>
                </div>

                <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:border-relif-orange-200 hover:text-relif-orange-200"
                >
                    View housing
                </Button>
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
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaBriefcaseMedical />
                        Medical information
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Allergies:</strong> Alergia a penicilina
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Current medications:</strong> Losartana, Inalador de Salbutamol
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
                            <strong>Mental Health:</strong> Histórico de ansiedade, em tratamento
                            com psicólogo
                        </li>
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
                    </ul>
                </div>
                <div className="w-full grow border-[1px] border-relif-orange-200 rounded-lg overflow-hidden">
                    <h3 className="pt-4 pl-4 pr-4 text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <MdOutlineFamilyRestroom />
                        Family
                    </h3>
                    <ul className="h-[480px] overflow-y-scroll overflow-x-hidden pt-2 pb-4 pl-4 pr-4 flex flex-col gap-2">
                        <Link href="#">
                            <li className="w-full rounded-md bg-relif-orange-200/10 flex gap-4 p-4 hover:bg-relif-orange-200/20 cursor-pointer">
                                <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                                    <Image
                                        src="https://github.com/anthonyvii27.png"
                                        alt="Family image"
                                        width={80}
                                        height={80}
                                        className="p-[1px] border-2 rounded-full border-relif-orange-200"
                                    />
                                </div>
                                <div className="h-max w-[calc(100%-80px)] flex flex-col">
                                    <span className="w-full text-sm text-slate-900 font-bold">
                                        Samanta Marks Oliver
                                    </span>
                                    <span className="w-full text-sm text-slate-500 mt-2 flex items-center gap-1">
                                        <FaBirthdayCake /> March 24, 1987
                                    </span>
                                    <div className="mt-3 flex gap-2">
                                        <span>
                                            <Badge className="flex">Wife</Badge>
                                        </span>
                                        <span>
                                            <Badge className="bg-relif-orange-400 flex items-center gap-1">
                                                <MdSpaceDashboard />
                                                In the same space
                                            </Badge>
                                        </span>
                                        <span>
                                            <Badge className="bg-relif-orange-400 flex items-center gap-1">
                                                <MdSpaceDashboard />
                                                In another space
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}
