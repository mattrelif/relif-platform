export type AddressSchema = {
    street_name: string;
    street_number: string;
    city: string;
    zip_code: string;
    district: string;
    country: string;
};

export type DocumentSchema = {
    type: string;
    value: string;
};

export type MedicalInformationSchema = {
    allergies: string[];
    current_medications: string[];
    recurrent_medical_conditions: string[];
    health_insurance_plans: string[];
    blood_type: string;
    taken_vaccines: string[];
    mental_health_history: string[];
    height: number;
    weight: number;
    cigarettes_usage: boolean;
    alcohol_consumption: boolean;
    disabilities: string[];
};

export type EmergencyContactSchema = {
    relationship: string;
    full_name: string;
    emails: string[];
    phones: string[];
};
