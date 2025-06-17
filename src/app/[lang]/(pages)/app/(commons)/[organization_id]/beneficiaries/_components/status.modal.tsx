"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateBeneficiaryStatus } from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaUserCheck, FaUserClock, FaUserTimes, FaArchive } from "react-icons/fa";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshList?: () => void;
    statusDialogOpenState: boolean;
    setStatusDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const STATUS_OPTIONS = [
    { 
        value: "ACTIVE", 
        label: "Active", 
        icon: FaUserCheck,
        color: "text-green-600",
        description: "Beneficiary is actively receiving services"
    },
    { 
        value: "INACTIVE", 
        label: "Inactive", 
        icon: FaUserTimes,
        color: "text-red-600",
        description: "Beneficiary is temporarily not receiving services"
    },
    { 
        value: "PENDING", 
        label: "Pending", 
        icon: FaUserClock,
        color: "text-orange-600",
        description: "Beneficiary is awaiting approval or processing"
    },
    { 
        value: "ARCHIVED", 
        label: "Archived", 
        icon: FaArchive,
        color: "text-gray-600",
        description: "Beneficiary record is archived and no longer active"
    },
];

const StatusModal = ({
    beneficiary,
    refreshList,
    statusDialogOpenState,
    setStatusDialogOpenState,
}: Props): ReactNode => {
    const dict = useDictionary();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>(beneficiary.status);

    const handleStatusUpdate = async () => {
        if (selectedStatus === beneficiary.status) {
            setStatusDialogOpenState(false);
            return;
        }

        setIsLoading(true);
        try {
            await updateBeneficiaryStatus(
                beneficiary.id, 
                selectedStatus as "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED"
            );

            toast({
                title: "Status Updated!",
                description: `Beneficiary status has been changed to ${STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label}.`,
                variant: "success",
            });

            if (refreshList) {
                refreshList();
            }
            setStatusDialogOpenState(false);
        } catch (error: any) {
            console.error("Failed to update beneficiary status:", error);
            
            let errorMessage = "An error occurred while updating the beneficiary status.";
            if (error?.response?.status === 403) {
                errorMessage = "You don't have permission to change beneficiary status.";
            } else if (error?.response?.status === 404) {
                errorMessage = "Beneficiary not found.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Invalid status value provided.";
            }

            toast({
                title: "Status Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === beneficiary.status);
    const selectedStatusOption = STATUS_OPTIONS.find(opt => opt.value === selectedStatus);

    return (
        <Dialog open={statusDialogOpenState} onOpenChange={setStatusDialogOpenState}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FaUserCheck className="text-relif-orange-200" />
                        Change Beneficiary Status
                    </DialogTitle>
                    <DialogDescription>
                        Update the status for <strong>{convertToTitleCase(beneficiary.full_name)}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Status */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {currentStatusOption && (
                            <>
                                <currentStatusOption.icon className={`w-4 h-4 ${currentStatusOption.color}`} />
                                <div>
                                    <p className="text-sm font-medium">Current Status</p>
                                    <p className="text-xs text-gray-600">{currentStatusOption.label}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="status-select">New Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger id="status-select">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className={`w-4 h-4 ${option.color}`} />
                                                <div>
                                                    <p className="font-medium">{option.label}</p>
                                                    <p className="text-xs text-gray-500">{option.description}</p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Change Preview */}
                    {selectedStatus !== beneficiary.status && selectedStatusOption && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <selectedStatusOption.icon className={`w-4 h-4 ${selectedStatusOption.color}`} />
                            <div>
                                <p className="text-sm font-medium text-blue-800">Will change to: {selectedStatusOption.label}</p>
                                <p className="text-xs text-blue-600">{selectedStatusOption.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleStatusUpdate} 
                        disabled={isLoading || selectedStatus === beneficiary.status}
                        className="min-w-[100px]"
                    >
                        {isLoading ? "Updating..." : "Update Status"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export { StatusModal }; 