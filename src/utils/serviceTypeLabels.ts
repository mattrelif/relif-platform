export const getServiceTypeLabel = (serviceType: string): string => {
    const serviceTypeMap: { [key: string]: string } = {
        'CHILD_PROTECTION_CASE_MANAGEMENT': 'Child Protection Case Management',
        'GBV_CASE_MANAGEMENT': 'Gender-Based Violence (GBV) Case Management',
        'GENERAL_PROTECTION_SERVICES': 'General Protection Services',
        'SEXUAL_VIOLENCE_RESPONSE': 'Sexual Violence Response',
        'INTIMATE_PARTNER_VIOLENCE_SUPPORT': 'Intimate Partner Violence Support',
        'HUMAN_TRAFFICKING_RESPONSE': 'Human Trafficking Response',
        'FAMILY_SEPARATION_REUNIFICATION': 'Family Separation and Reunification',
        'UASC_SERVICES': 'Unaccompanied and Separated Children (UASC) Services',
        'MHPSS': 'Mental Health and Psychosocial Support (MHPSS)',
        'LEGAL_AID_ASSISTANCE': 'Legal Aid and Assistance',
        'CIVIL_DOCUMENTATION_SUPPORT': 'Civil Documentation Support',
        'EMERGENCY_SHELTER_HOUSING': 'Emergency Shelter and Housing',
        'NFI_DISTRIBUTION': 'Non-Food Items (NFI) Distribution',
        'FOOD_SECURITY_NUTRITION': 'Food Security and Nutrition',
        'CVA': 'Cash and Voucher Assistance (CVA)',
        'WASH': 'Water, Sanitation and Hygiene (WASH)',
        'HEALTHCARE_SERVICES': 'Healthcare Services',
        'EMERGENCY_MEDICAL_CARE': 'Emergency Medical Care',
        'SEXUAL_REPRODUCTIVE_HEALTH': 'Sexual and Reproductive Health Services',
        'DISABILITY_SUPPORT_SERVICES': 'Disability Support Services',
        'EMERGENCY_EVACUATION': 'Emergency Evacuation',
        'SEARCH_RESCUE_COORDINATION': 'Search and Rescue Coordination',
        'EMERGENCY_RESPONSE_COORDINATION': 'Emergency Response Coordination',
        'COMMUNITY_MOBILIZATION': 'Community Mobilization',
        'CAPACITY_BUILDING_TRAINING': 'Capacity Building and Training',
        'LIVELIHOOD_SUPPORT': 'Livelihood Support and Economic Empowerment',
        'EDUCATION_SERVICES': 'Education Services',
        'CHILD_FRIENDLY_SPACES': 'Child-Friendly Spaces',
        'WOMEN_SAFE_SPACES': 'Women and Girls Safe Spaces',
        'COMMUNITY_BASED_PROTECTION': 'Community-Based Protection',
        'REFERRAL_COORDINATION': 'Referral and Coordination Services'
    };

    return serviceTypeMap[serviceType] || serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}; 