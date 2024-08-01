"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    user: UserSchema;
    refreshList: () => void;
    removeUserDialogOpenState: boolean;
    setRemoveUserDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserRemove = ({
    user,
    refreshList,
    removeUserDialogOpenState,
    setRemoveUserDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteUser(user.id);
            refreshList();

            setRemoveUserDialogOpenState(false);
            toast({
                title: "Removed!",
                description: "User removed successfully.",
                variant: "success",
            });
        } catch {
            toast({
                title: "Invalid entered data",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeUserDialogOpenState} onOpenChange={setRemoveUserDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the user below.
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">
                            {user?.first_name} {user?.last_name}
                        </span>
                        <span className="text-xs text-slate-500">{user?.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button
                            variant="outline"
                            onClick={() => setRemoveUserDialogOpenState(false)}
                        >
                            Cancel
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>Delete</Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserRemove };
