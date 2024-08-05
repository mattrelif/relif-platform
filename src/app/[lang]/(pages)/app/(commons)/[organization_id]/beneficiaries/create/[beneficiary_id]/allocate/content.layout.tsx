"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getSpacesByHousingId } from "@/repository/housing.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { SpaceSchema } from "@/types/space.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { IoMdAlert } from "react-icons/io";

type Props = {
    beneficiaryId: string;
};

const Content = ({ beneficiaryId }: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");

    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [selectedHousing, setSelectedHousing] = useState("");
    const [spaces, setSpaces] = useState<SpaceSchema[] | []>([]);
    const [selectedSpace, setSelectedSpace] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");
                if (currentUser && currentUser.organization_id) {
                    const { data: housingResponse } = await findHousingsByOrganizationId(
                        currentUser.organization_id,
                        0,
                        9999
                    );
                    setHousings(housingResponse.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const getSpaces = async (housingId: string) => {
        setSpaces([]);
        setSelectedHousing(housingId);

        try {
            const { data: spaceResponse } = await getSpacesByHousingId(housingId, 0, 9999);
            setSpaces(spaceResponse.data);
        } catch {
            setError(true);
        }
    };

    const handleMove = async (): Promise<void> => {
        try {
            // TODO: ENDPOINT
            console.log(selectedHousing, selectedSpace);

            router.push(backToListPath);

            toast({
                title: "Beneficiary allocated",
                description: "The beneficiary has been successfully moved to the new shelter.",
            });
        } catch {
            toast({
                title: "Error Moving Beneficiary",
                description: "An error occurred while attempting to allocate the beneficiary.",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <h1 className="text-relif-orange-200 text-xl font-bold flex items-center gap-2 p-4">
                <FaHouseChimneyUser />
                Allocate beneficiary
            </h1>

            {housings.length === 0 && (
                <div className="p-4">
                    <Alert>
                        <IoMdAlert className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription className="text-slate-500">
                            You cannot associate the beneficiary with a housing at this moment
                            because there are no housing registered yet. To associate, please return
                            to the beneficiaries listing and, either from the list or the
                            beneficiary's profile, go to "Move" and associate them with a new
                            housing after creating it.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {housings.length !== 0 && (
                <div className="p-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="housing">Housing *</Label>
                        <Select onValueChange={getSpaces} required>
                            <SelectTrigger className="w-full" id="housing">
                                <SelectValue
                                    placeholder={!isLoading ? "Select housing..." : "Loading..."}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {housings.map(housing => (
                                    <SelectItem value={housing.id}>{housing.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="space">Space *</Label>
                        <Select onValueChange={setSelectedSpace} required>
                            <SelectTrigger className="w-full" id="space">
                                <SelectValue placeholder="Select space..." />
                            </SelectTrigger>
                            <SelectContent>
                                {spaces?.map(space => (
                                    <SelectItem value={space.id}>
                                        {space.name} [{space.available_vacancies} of{" "}
                                        {space.total_vacancies} available]
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {housings.length !== 0 ? (
                <div className="flex gap-4 p-4">
                    <Button variant="outline" onClick={() => router.push(backToListPath)}>
                        Do this later
                    </Button>
                    <Button onClick={handleMove}>Allocate</Button>
                </div>
            ) : (
                <div className="flex gap-4 p-4">
                    <Button variant="outline" asChild>
                        <Link href={backToListPath}>Back to beneficiary list</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export { Content };
