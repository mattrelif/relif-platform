export interface CaseSchema {
    id: string;
    case_number: string;
    title: string;
    description: string;
    status: "IN_PROGRESS" | "PENDING" | "ON_HOLD" | "CLOSED" | "CANCELLED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    urgency_level?: "IMMEDIATE" | "WITHIN_WEEK" | "WITHIN_MONTH" | "FLEXIBLE";
    service_types: (
        | "CHILD_PROTECTION_CASE_MANAGEMENT"
        | "GBV_CASE_MANAGEMENT"
        | "GENERAL_PROTECTION_SERVICES"
        | "SEXUAL_VIOLENCE_RESPONSE"
        | "INTIMATE_PARTNER_VIOLENCE_SUPPORT"
        | "HUMAN_TRAFFICKING_RESPONSE"
        | "FAMILY_SEPARATION_REUNIFICATION"
        | "UASC_SERVICES"
        | "MHPSS"
        | "LEGAL_AID_ASSISTANCE"
        | "CIVIL_DOCUMENTATION_SUPPORT"
        | "EMERGENCY_SHELTER_HOUSING"
        | "NFI_DISTRIBUTION"
        | "FOOD_SECURITY_NUTRITION"
        | "CVA"
        | "WASH"
        | "HEALTHCARE_SERVICES"
        | "EMERGENCY_MEDICAL_CARE"
        | "SEXUAL_REPRODUCTIVE_HEALTH"
        | "DISABILITY_SUPPORT_SERVICES"
        | "EMERGENCY_EVACUATION"
        | "SEARCH_RESCUE_COORDINATION"
        | "RAPID_ASSESSMENT_NEEDS_ANALYSIS"
        | "EMERGENCY_REGISTRATION"
        | "EMERGENCY_TRANSPORTATION"
        | "EMERGENCY_COMMUNICATION_SERVICES"
        | "EMERGENCY_EDUCATION_SERVICES"
        | "CHILD_FRIENDLY_SPACES"
        | "SKILLS_TRAINING_VOCATIONAL_EDUCATION"
        | "LITERACY_PROGRAMS"
        | "AWARENESS_PREVENTION_CAMPAIGNS"
        | "LIVELIHOOD_SUPPORT_PROGRAMS"
        | "MICROFINANCE_CREDIT_SERVICES"
        | "JOB_PLACEMENT_EMPLOYMENT_SERVICES"
        | "AGRICULTURAL_SUPPORT"
        | "BUSINESS_DEVELOPMENT_SUPPORT"
        | "REFUGEE_SERVICES"
        | "IDP_SERVICES"
        | "RETURNEE_REINTEGRATION_SERVICES"
        | "HOST_COMMUNITY_SUPPORT"
        | "ELDERLY_CARE_SERVICES"
        | "SERVICES_FOR_PERSONS_WITH_DISABILITIES"
        | "CASE_REFERRAL_TRANSFER"
        | "INTER_AGENCY_COORDINATION"
        | "SERVICE_MAPPING_INFORMATION"
        | "FOLLOW_UP_MONITORING"
        | "CASE_CLOSURE_TRANSITION"
        | "BIRTH_REGISTRATION"
        | "IDENTITY_DOCUMENTATION"
        | "LEGAL_COUNSELING"
        | "COURT_SUPPORT_ACCOMPANIMENT"
        | "DETENTION_MONITORING"
        | "ADVOCACY_SERVICES"
        | "PRIMARY_HEALTHCARE"
        | "CLINICAL_MANAGEMENT_RAPE"
        | "HIV_AIDS_PREVENTION_TREATMENT"
        | "TUBERCULOSIS_TREATMENT"
        | "MALNUTRITION_TREATMENT"
        | "VACCINATION_PROGRAMS"
        | "EMERGENCY_SURGERY"
        | "CAMP_COORDINATION_MANAGEMENT"
        | "MINE_ACTION_SERVICES"
        | "PEACEKEEPING_PEACEBUILDING"
        | "LOGISTICS_TELECOMMUNICATIONS"
        | "INFORMATION_MANAGEMENT"
        | "COMMUNITY_MOBILIZATION"
        | "WINTERIZATION_SUPPORT"
    )[];
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
    note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "REFERRAL" | "OTHER";
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
    document_type:
        | "FORM"
        | "REPORT"
        | "EVIDENCE"
        | "CORRESPONDENCE"
        | "IDENTIFICATION"
        | "LEGAL"
        | "MEDICAL"
        | "OTHER";
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
    service_types: (
        | "CHILD_PROTECTION_CASE_MANAGEMENT"
        | "GBV_CASE_MANAGEMENT"
        | "GENERAL_PROTECTION_SERVICES"
        | "SEXUAL_VIOLENCE_RESPONSE"
        | "INTIMATE_PARTNER_VIOLENCE_SUPPORT"
        | "HUMAN_TRAFFICKING_RESPONSE"
        | "FAMILY_SEPARATION_REUNIFICATION"
        | "UASC_SERVICES"
        | "MHPSS"
        | "LEGAL_AID_ASSISTANCE"
        | "CIVIL_DOCUMENTATION_SUPPORT"
        | "EMERGENCY_SHELTER_HOUSING"
        | "NFI_DISTRIBUTION"
        | "FOOD_SECURITY_NUTRITION"
        | "CVA"
        | "WASH"
        | "HEALTHCARE_SERVICES"
        | "EMERGENCY_MEDICAL_CARE"
        | "SEXUAL_REPRODUCTIVE_HEALTH"
        | "DISABILITY_SUPPORT_SERVICES"
        | "EMERGENCY_EVACUATION"
        | "SEARCH_RESCUE_COORDINATION"
        | "RAPID_ASSESSMENT_NEEDS_ANALYSIS"
        | "EMERGENCY_REGISTRATION"
        | "EMERGENCY_TRANSPORTATION"
        | "EMERGENCY_COMMUNICATION_SERVICES"
        | "EMERGENCY_EDUCATION_SERVICES"
        | "CHILD_FRIENDLY_SPACES"
        | "SKILLS_TRAINING_VOCATIONAL_EDUCATION"
        | "LITERACY_PROGRAMS"
        | "AWARENESS_PREVENTION_CAMPAIGNS"
        | "LIVELIHOOD_SUPPORT_PROGRAMS"
        | "MICROFINANCE_CREDIT_SERVICES"
        | "JOB_PLACEMENT_EMPLOYMENT_SERVICES"
        | "AGRICULTURAL_SUPPORT"
        | "BUSINESS_DEVELOPMENT_SUPPORT"
        | "REFUGEE_SERVICES"
        | "IDP_SERVICES"
        | "RETURNEE_REINTEGRATION_SERVICES"
        | "HOST_COMMUNITY_SUPPORT"
        | "ELDERLY_CARE_SERVICES"
        | "SERVICES_FOR_PERSONS_WITH_DISABILITIES"
        | "CASE_REFERRAL_TRANSFER"
        | "INTER_AGENCY_COORDINATION"
        | "SERVICE_MAPPING_INFORMATION"
        | "FOLLOW_UP_MONITORING"
        | "CASE_CLOSURE_TRANSITION"
        | "BIRTH_REGISTRATION"
        | "IDENTITY_DOCUMENTATION"
        | "LEGAL_COUNSELING"
        | "COURT_SUPPORT_ACCOMPANIMENT"
        | "DETENTION_MONITORING"
        | "ADVOCACY_SERVICES"
        | "PRIMARY_HEALTHCARE"
        | "CLINICAL_MANAGEMENT_RAPE"
        | "HIV_AIDS_PREVENTION_TREATMENT"
        | "TUBERCULOSIS_TREATMENT"
        | "MALNUTRITION_TREATMENT"
        | "VACCINATION_PROGRAMS"
        | "EMERGENCY_SURGERY"
        | "CAMP_COORDINATION_MANAGEMENT"
        | "MINE_ACTION_SERVICES"
        | "PEACEKEEPING_PEACEBUILDING"
        | "LOGISTICS_TELECOMMUNICATIONS"
        | "INFORMATION_MANAGEMENT"
        | "COMMUNITY_MOBILIZATION"
        | "WINTERIZATION_SUPPORT"
    )[];
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    urgency_level?: "IMMEDIATE" | "WITHIN_WEEK" | "WITHIN_MONTH" | "FLEXIBLE";
    due_date?: string;
    estimated_duration?: string;
    budget_allocated?: string;
    tags?: string[];
    initial_note?: {
        title: string;
        content: string;
        note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "REFERRAL" | "OTHER";
        is_important: boolean;
        tags: string[];
    };
    documents?: {
        document_name: string;
        document_type:
            | "FORM"
            | "REPORT"
            | "EVIDENCE"
            | "CORRESPONDENCE"
            | "IDENTIFICATION"
            | "LEGAL"
            | "MEDICAL"
            | "OTHER";
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
    service_types?: (
        | "CHILD_PROTECTION_CASE_MANAGEMENT"
        | "GBV_CASE_MANAGEMENT"
        | "GENERAL_PROTECTION_SERVICES"
        | "SEXUAL_VIOLENCE_RESPONSE"
        | "INTIMATE_PARTNER_VIOLENCE_SUPPORT"
        | "HUMAN_TRAFFICKING_RESPONSE"
        | "FAMILY_SEPARATION_REUNIFICATION"
        | "UASC_SERVICES"
        | "MHPSS"
        | "LEGAL_AID_ASSISTANCE"
        | "CIVIL_DOCUMENTATION_SUPPORT"
        | "EMERGENCY_SHELTER_HOUSING"
        | "NFI_DISTRIBUTION"
        | "FOOD_SECURITY_NUTRITION"
        | "CVA"
        | "WASH"
        | "HEALTHCARE_SERVICES"
        | "EMERGENCY_MEDICAL_CARE"
        | "SEXUAL_REPRODUCTIVE_HEALTH"
        | "DISABILITY_SUPPORT_SERVICES"
        | "EMERGENCY_EVACUATION"
        | "SEARCH_RESCUE_COORDINATION"
        | "RAPID_ASSESSMENT_NEEDS_ANALYSIS"
        | "EMERGENCY_REGISTRATION"
        | "EMERGENCY_TRANSPORTATION"
        | "EMERGENCY_COMMUNICATION_SERVICES"
        | "EMERGENCY_EDUCATION_SERVICES"
        | "CHILD_FRIENDLY_SPACES"
        | "SKILLS_TRAINING_VOCATIONAL_EDUCATION"
        | "LITERACY_PROGRAMS"
        | "AWARENESS_PREVENTION_CAMPAIGNS"
        | "LIVELIHOOD_SUPPORT_PROGRAMS"
        | "MICROFINANCE_CREDIT_SERVICES"
        | "JOB_PLACEMENT_EMPLOYMENT_SERVICES"
        | "AGRICULTURAL_SUPPORT"
        | "BUSINESS_DEVELOPMENT_SUPPORT"
        | "REFUGEE_SERVICES"
        | "IDP_SERVICES"
        | "RETURNEE_REINTEGRATION_SERVICES"
        | "HOST_COMMUNITY_SUPPORT"
        | "ELDERLY_CARE_SERVICES"
        | "SERVICES_FOR_PERSONS_WITH_DISABILITIES"
        | "CASE_REFERRAL_TRANSFER"
        | "INTER_AGENCY_COORDINATION"
        | "SERVICE_MAPPING_INFORMATION"
        | "FOLLOW_UP_MONITORING"
        | "CASE_CLOSURE_TRANSITION"
        | "BIRTH_REGISTRATION"
        | "IDENTITY_DOCUMENTATION"
        | "LEGAL_COUNSELING"
        | "COURT_SUPPORT_ACCOMPANIMENT"
        | "DETENTION_MONITORING"
        | "ADVOCACY_SERVICES"
        | "PRIMARY_HEALTHCARE"
        | "CLINICAL_MANAGEMENT_RAPE"
        | "HIV_AIDS_PREVENTION_TREATMENT"
        | "TUBERCULOSIS_TREATMENT"
        | "MALNUTRITION_TREATMENT"
        | "VACCINATION_PROGRAMS"
        | "EMERGENCY_SURGERY"
        | "CAMP_COORDINATION_MANAGEMENT"
        | "MINE_ACTION_SERVICES"
        | "PEACEKEEPING_PEACEBUILDING"
        | "LOGISTICS_TELECOMMUNICATIONS"
        | "INFORMATION_MANAGEMENT"
        | "COMMUNITY_MOBILIZATION"
        | "WINTERIZATION_SUPPORT"
    )[];
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
    note_type: "CALL" | "MEETING" | "UPDATE" | "APPOINTMENT" | "REFERRAL" | "OTHER";
    is_important: boolean;
}

export interface CreateCaseDocumentPayload {
    document_name: string;
    document_type:
        | "FORM"
        | "REPORT"
        | "EVIDENCE"
        | "CORRESPONDENCE"
        | "IDENTIFICATION"
        | "LEGAL"
        | "MEDICAL"
        | "OTHER";
    description: string;
    tags: string[];
    file: File;
}
