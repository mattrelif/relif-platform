"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { OrganizationSchema } from "@/types/organization.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    organization: OrganizationSchema;
    refreshList?: () => void;
    enableDialogOpenState: boolean;
    setEnableDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const EnableModal = ({
    organization,
    refreshList,
    enableDialogOpenState,
    setEnableDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDisable = async (): Promise<void> => {
        try {
            setIsLoading(true);

            // TODO: BACKEND
            // await disableAccessToHousing(organization.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/organizations");
            }

            toast({
                title: "Access Enabled",
                description: "Access to the organization was successfully disabled.",
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: "Enable Access Failed",
                description:
                    "An error occurred while attempting to disable access to the organization. Please try again later or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    if (organization && organization.address) {
        return (
            <Dialog open={enableDialogOpenState} onOpenChange={setEnableDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3">Enable Access?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to re-enable access to this housing? This action
                            can be reversed by re-enabling access later if necessary.
                        </DialogDescription>
                        <div className="flex flex-col pt-4">
                            <span className="text-sm text-slate-900 font-bold">
                                {organization?.name}
                            </span>
                            <span className="text-xs text-slate-500">
                                {`${organization?.address.address_line_1}, ${organization?.address.address_line_2} - ${organization?.address.city}, ${organization?.address.district} | ${organization?.address.zip_code} - ${organization?.address.country}`}
                            </span>
                        </div>

                        <div className="flex gap-4 pt-5">
                            <Button
                                variant="outline"
                                onClick={() => setEnableDialogOpenState(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleDisable}>
                                {!isLoading ? "Disable Access" : "Loading..."}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return <div />;
};

export { EnableModal };
