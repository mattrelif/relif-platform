"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { reallocateBeneficiary } from "@/repository/beneficiary.repository";
import { getSpacesByHousingId } from "@/repository/housing.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { HousingSchema } from "@/types/housing.types";
import { SpaceSchema } from "@/types/space.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshList?: () => void;
    moveDialogOpenState: boolean;
    setMoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const MoveModal = ({
    beneficiary,
    refreshList,
    moveDialogOpenState,
    setMoveDialogOpenState,
}: Props): ReactNode => {
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
            await reallocateBeneficiary(beneficiary.id, selectedHousing, selectedSpace);

            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            setMoveDialogOpenState(false);
            toast({
                title: "Beneficiary Relocated",
                description: "The beneficiary has been successfully moved to the new housing.",
                variant: "success",
            });
        } catch {
            toast({
                title: "Error Moving Beneficiary",
                description:
                    "An error occurred while attempting to move the beneficiary. Please check the entered data and try again.",
                variant: "destructive",
            });
        }
    };

    if (isLoading)
        return <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2>;

    if (error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                Something went wrong. Please try again later.
            </span>
        );

    return (
        <Dialog open={moveDialogOpenState} onOpenChange={setMoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Confirm Beneficiary Move</DialogTitle>
                    <DialogDescription>
                        You are about to move the beneficiary to a different location. Please ensure
                        that this is the intended action before proceeding, as it may affect their
                        current housing arrangements.
                    </DialogDescription>

                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {beneficiary.full_name}
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>Current:</strong>{" "}
                            {!beneficiary.current_housing_id
                                ? "Unallocated"
                                : `${beneficiary.current_housing_id} (housed on ${beneficiary.current_room_id})`}
                        </span>
                    </div>
                    {housings.length === 0 && (
                        <span className="text-sm text-red-500 font-medium pt-4">
                            No housings found...
                        </span>
                    )}

                    {housings.length > 0 && (
                        <div className="pt-4 flex flex-col gap-2">
                            <span className="text-xs text-slate-500 font-bold">To:</span>
                            <Select onValueChange={getSpaces} required>
                                <SelectTrigger className="w-full" id="housing">
                                    <SelectValue placeholder="Select housing..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {housings.map(housing => (
                                        <SelectItem value={housing.id}>{housing.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedSpace} required>
                                <SelectTrigger className="w-full" id="space">
                                    <SelectValue placeholder="Select space..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {spaces?.map(space => (
                                        <SelectItem value={space.id}>
                                            {space.name} [
                                            {space.total_vacancies - space.occupied_vacancies} of{" "}
                                            {space.total_vacancies} occupied]
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setMoveDialogOpenState(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleMove} disabled={housings.length === 0}>
                            Move
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { MoveModal };
