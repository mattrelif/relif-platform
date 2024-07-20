import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    removeUserDialogOpenState: boolean;
    setRemoveUserDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserRemove = ({
    removeUserDialogOpenState,
    setRemoveUserDialogOpenState,
}: Props): ReactNode => (
    <Dialog open={removeUserDialogOpenState} onOpenChange={setRemoveUserDialogOpenState}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete the user below.
                </DialogDescription>
                <div className="flex flex-col pt-4">
                    <span className="text-sm text-slate-900 font-bold">Anthony Vinicius</span>
                    <span className="text-xs text-slate-500">anthony.vii27@gmail.com</span>
                </div>
                <div className="flex gap-4 pt-5">
                    <Button variant="outline" onClick={() => setRemoveUserDialogOpenState(false)}>
                        Cancel
                    </Button>
                    <Button>Delete</Button>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
);

export { UserRemove };
