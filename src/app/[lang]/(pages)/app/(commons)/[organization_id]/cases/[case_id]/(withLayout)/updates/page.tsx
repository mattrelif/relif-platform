import { ReactNode } from "react";
import { NotesContent } from "../notes/content";

interface UpdatesPageProps {
    params: {
        case_id: string;
    };
}

export default function UpdatesPage({ params }: UpdatesPageProps): ReactNode {
    return <NotesContent />;
} 