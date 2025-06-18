"use client";

import React, { useState } from "react";
import { AddressAutocomplete, AddressData } from "@/components/ui/address-autocomplete";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";

// Example of how to modify the beneficiary creation form
const ExampleBeneficiaryForm = () => {
    const { apiKey, isReady } = useGooglePlaces();
    const [addressData, setAddressData] = useState<AddressData | null>(null);

    const handleAddressSelect = (address: AddressData) => {
        setAddressData(address);
        console.log("Selected address:", address);
        
        // You can now use this data in your form submission
        // The address data will be automatically populated in the component
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        
        // Add address data to form submission
        if (addressData) {
            formData.append('address_line_1', addressData.address_line_1);
            formData.append('address_line_2', addressData.address_line_2);
            formData.append('city', addressData.city);
            formData.append('district', addressData.district);
            formData.append('zip_code', addressData.zip_code);
            formData.append('country', addressData.country);
        }

        // Submit your form data...
        console.log("Form data with address:", Object.fromEntries(formData));
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Your existing form fields... */}
            
            {/* Replace the old address section with this: */}
            {isReady ? (
                <AddressAutocomplete
                    googleApiKey={apiKey}
                    onAddressSelect={handleAddressSelect}
                    labels={{
                        addressLine1: "Address Line 1",
                        addressLine2: "Address Line 2", 
                        city: "City",
                        state: "State",
                        zipCode: "ZIP Code",
                        country: "Country"
                    }}
                    required={true}
                />
            ) : (
                <div className="p-4 text-gray-500">
                    Google Places API not configured. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your environment variables.
                </div>
            )}

            {/* Your other form fields... */}
        </form>
    );
};

// INTEGRATION STEPS:
// 
// 1. Add your Google API key to environment variables:
//    Create a .env.local file with:
//    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
//
// 2. Import the components in your form file:
//    import { AddressAutocomplete, AddressData } from "@/components/ui/address-autocomplete";
//    import { useGooglePlaces } from "@/hooks/useGooglePlaces";
//
// 3. Add state management:
//    const { apiKey, isReady } = useGooglePlaces();
//    const [addressData, setAddressData] = useState<AddressData | null>(null);
//
// 4. Replace your existing address section HTML with:
//    <AddressAutocomplete
//        googleApiKey={apiKey}
//        onAddressSelect={setAddressData}
//        labels={{
//            addressLine1: dict.commons.beneficiaries.create.addressLine + " 1",
//            addressLine2: dict.commons.beneficiaries.create.addressLine + " 2",
//            city: dict.commons.beneficiaries.create.city,
//            state: dict.commons.beneficiaries.create.state,
//            zipCode: dict.commons.beneficiaries.create.postalCode,
//            country: dict.commons.beneficiaries.create.country
//        }}
//        required={true}
//    />
//
// 5. Update your form submission to use addressData state instead of individual form fields

export default ExampleBeneficiaryForm; 