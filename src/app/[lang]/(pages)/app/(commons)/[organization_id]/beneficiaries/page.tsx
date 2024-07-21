import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ReactNode } from "react";
import {
    FaDownload,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaEdit,
    FaTrash,
    FaFileCsv,
    FaFilePdf,
} from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { MdSearch } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-end gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <MdSearch className="text-slate-400 text-2xl" />
                    <Input type="text" placeholder="Search" className="w-[300px]" />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-[40px] h-[40px] p-0">
                            <FaDownload />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="flex gap-2">
                            <FaFileCsv />
                            Download CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2">
                            <FaFilePdf />
                            Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="h-[calc(100vh-172px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
                        <div className="flex gap-4">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src="https://github.com/anthonyvii27.png" />
                                <AvatarFallback className="bg-relif-orange-200 text-white">
                                    AV
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-900 font-bold">
                                    Anthony Vinicius Mota Silva
                                </span>
                                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <FaMapMarkerAlt />
                                    Abrigo Santo Agostino (Since Mar 04, 2023)
                                </span>
                                <div></div>
                                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <FaBirthdayCake /> Feb 27, 2000
                                </span>
                                <div className="flex mt-2 gap-2">
                                    <span>
                                        <Badge className="bg-yellow-300 text-slate-900">
                                            Underage
                                        </Badge>
                                    </span>
                                    <span>
                                        <Badge className="bg-blue-600">Men</Badge>
                                    </span>
                                    <span>
                                        <Badge className="bg-pink-500">Woman</Badge>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="icon" className="w-7 h-7 p-0">
                                        <SlOptions className="text-sm" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>View his/her housing</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span className="flex items-center gap-2">
                                            <FaEdit className="text-xs" />
                                            Edit beneficiary
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span className="flex items-center gap-2">
                                            <FaTrash className="text-xs" />
                                            Remove beneficiary
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span className="flex items-center gap-2">
                                            <IoMdMove className="text-xs" />
                                            Move to other housing
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    Created at Sep 14, 2022
                                </span>
                                <span>
                                    <Badge>Active</Badge>
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">4</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
