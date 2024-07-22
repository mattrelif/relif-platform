import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { ReactNode } from "react";

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
                    <Image
                        src="https://github.com/anthonyvii27.png"
                        alt="Beneficiary image"
                        width={130}
                        height={130}
                        className="border-2 rounded-full border-white"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Anthony Vinicius Mota Silva
                    </h2>
                    <span className="text-sm text-slate-500 flex items-center gap-4">
                        Registered in February 14, 2023<Badge>Active</Badge>
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3">
                        Personal data
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Full name:</strong> Anthony Vinicius Mota Silva
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Birthdate:</strong> February 27, 2024
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>E-mail:</strong> anthony.vii27@gmail.com
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Gender:</strong> Men
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap gap-2">
                            <strong>Phones:</strong>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge className="cursor-pointer">+55 21 97586-9797</Badge>
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
                                    <Badge className="cursor-pointer">+55 21 97586-9797</Badge>
                                    <Badge className="cursor-pointer">+55 21 91234-5678</Badge>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Civil status:</strong> Single
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Language:</strong>{" "}
                            <Badge className="bg-relif-orange-500">Portuguese</Badge>
                            <Badge className="bg-relif-orange-500">English</Badge>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Education:</strong> Graduation
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Occupation:</strong> Software Engineer
                        </li>
                    </ul>
                </div>
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3">Address</h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Address:</strong> Rua de Exemplo, 450 - Bloco 12, Apto 405
                        </li>
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>City:</strong> Rio de Janeiro
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>State / Province:</strong> Rio de Janeiro
                            </li>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Zip / Postal Code:</strong> 12345-123
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Country:</strong> Brazil
                            </li>
                        </div>
                    </ul>
                    <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4">
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
                                        <Badge className="cursor-pointer">+55 21 97586-9797</Badge>
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
                                    <Badge className="cursor-pointer">+55 21 97586-9797</Badge>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
