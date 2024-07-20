import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

const CoordinationRequestDialog = ({ children }: { children: Readonly<ReactNode> }): ReactNode => (
    <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="pb-3">
                    Are you sure you want to request this feature?
                </DialogTitle>
                <DialogDescription>
                    The request will be sent for analysis by our team.{" "}
                    <strong>The evaluation process takes between 7 and 10 business days.</strong>{" "}
                    Additionally, we may need to contact you for data validation.
                </DialogDescription>
                <div className="flex gap-4 pt-5">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Send request</Button>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
);

export { CoordinationRequestDialog };
