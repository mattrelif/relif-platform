export interface CaseSchema {
    id: string;
    case_number: string;
    title: string;
    description: string;
    status: "IN_PROGRESS" | "PENDING" | "ON_HOLD" | "CLOSED" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    urgency_level?: "IMMEDIATE" | "WITHIN_WEEK" | "WITHIN_MONTH" | "FLEXIBLE";
    case_type: "HOUSING" | "LEGAL" | "MEDICAL" | "SUPPORT" | "EDUCATION" | "EMPLOYMENT" | "FINANCIAL" | "FAMILY_REUNIFICATION" | "DOCUMENTATION" | "MENTAL_HEALTH" | "OTHER";
    beneficiary_id: string;
    beneficiary: {
        id: string;
        first_name: string;
        last_name: string;
        full_name: string;
        phone?: string;
        email?: string;
        current_address?: string;
        image_url?: string;
    };
    assigned_to_id: string;
    assigned_to: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    due_date?: string;
    estimated_duration?: string;
    budget_allocated?: string;
    tags?: string[];
    notes_count: number;
    documents_count: number;
    last_activity: string;
    created_at: string;
    updated_at: string;
}

export interface CaseNoteSchema {
    id: string;
    case_id: string;
    title: string;
    content: string;
    tags: string[];
    note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "OTHER";
    is_important: boolean;
    created_by: {
        id: string;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface CaseDocumentSchema {
    id: string;
    case_id: string;
    document_name: string;
    file_name: string;
    document_type: "FORM" | "REPORT" | "EVIDENCE" | "CORRESPONDENCE" | "IDENTIFICATION" | "LEGAL" | "MEDICAL" | "OTHER";
    file_size: number;
    mime_type: string;
    description: string;
    tags: string[];
    uploaded_by: {
        id: string;
        name: string;
    };
    created_at: string;
    download_url: string;
}

export interface CaseStatsSchema {
    total_cases: number;
    open_cases: number;
    in_progress_cases: number;
    overdue_cases: number;
    closed_this_month: number;
    avg_resolution_days: number;
}

export interface CreateCasePayload {
    beneficiary_id: string;
    assigned_to_id: string;
    title: string;
    description: string;
    case_type: "HOUSING" | "LEGAL" | "MEDICAL" | "SUPPORT" | "EDUCATION" | "EMPLOYMENT" | "FINANCIAL" | "FAMILY_REUNIFICATION" | "DOCUMENTATION" | "MENTAL_HEALTH" | "OTHER";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    urgency_level?: "IMMEDIATE" | "WITHIN_WEEK" | "WITHIN_MONTH" | "FLEXIBLE";
    due_date?: string;
    estimated_duration?: string;
    budget_allocated?: string;
    tags?: string[];
    initial_note?: {
        title: string;
        content: string;
        note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "OTHER";
        is_important: boolean;
        tags: string[];
    };
    documents?: {
        document_name: string;
        document_type: "FORM" | "REPORT" | "EVIDENCE" | "CORRESPONDENCE" | "IDENTIFICATION" | "LEGAL" | "MEDICAL" | "OTHER";
        description: string;
        tags: string[];
        file: File;
    }[];
}

export interface UpdateCasePayload {
    title?: string;
    description?: string;
    status?: "IN_PROGRESS" | "PENDING" | "ON_HOLD" | "CLOSED" | "CANCELLED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    urgency_level?: "IMMEDIATE" | "WITHIN_WEEK" | "WITHIN_MONTH" | "FLEXIBLE";
    case_type?: "HOUSING" | "LEGAL" | "MEDICAL" | "SUPPORT" | "EDUCATION" | "EMPLOYMENT" | "FINANCIAL" | "FAMILY_REUNIFICATION" | "DOCUMENTATION" | "MENTAL_HEALTH" | "OTHER";
    assigned_to_id?: string;
    due_date?: string;
    estimated_duration?: string;
    budget_allocated?: string;
    tags?: string[];
}

export interface CreateCaseNotePayload {
    title: string;
    content: string;
    tags: string[];
    note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "OTHER";
    is_important: boolean;
}

export interface CreateCaseDocumentPayload {
    document_name: string;
    document_type: "FORM" | "REPORT" | "EVIDENCE" | "CORRESPONDENCE" | "IDENTIFICATION" | "LEGAL" | "MEDICAL" | "OTHER";
    description: string;
    tags: string[];
    file: File;
} 