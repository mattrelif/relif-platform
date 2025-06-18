"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Declare global google object
declare global {
    interface Window {
        google: any;
        initGooglePlaces: () => void;
    }
}

export interface AddressData {
    address_line_1: string;
    address_line_2: string;
    city: string;
    district: string; // state/province
    zip_code: string;
    country: string;
}

interface AddressAutocompleteProps {
    onAddressSelect: (address: AddressData) => void;
    defaultValues?: Partial<AddressData>;
    googleApiKey: string;
    className?: string;
    labels?: {
        sectionTitle?: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    required?: boolean;
    disabled?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    onAddressSelect,
    defaultValues = {},
    googleApiKey,
    className,
    labels = {
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        city: "City",
        state: "State",
        zipCode: "ZIP Code",
        country: "Country"
    },
    required = false,
    disabled = false
}) => {
    const autocompleteRef = useRef<HTMLInputElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [address, setAddress] = useState<AddressData>({
        address_line_1: defaultValues.address_line_1 || "",
        address_line_2: defaultValues.address_line_2 || "",
        city: defaultValues.city || "",
        district: defaultValues.district || "",
        zip_code: defaultValues.zip_code || "",
        country: defaultValues.country || ""
    });

    // Load Google Places API
    useEffect(() => {
        console.log("AddressAutocomplete: API Key received:", googleApiKey ? "Present" : "Missing");
        
        if (window.google?.maps?.places) {
            console.log("Google Places already loaded");
            setIsLoaded(true);
            return;
        }

        if (!googleApiKey) {
            console.error("No Google API key provided to AddressAutocomplete");
            return;
        }

        // Define callback function for when script loads
        window.initGooglePlaces = () => {
            console.log("Google Places API loaded successfully");
            setIsLoaded(true);
        };

        // Check if script is already loading
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            console.log("Loading Google Places script with key:", googleApiKey.substring(0, 10) + "...");
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initGooglePlaces`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                console.error("Failed to load Google Places script");
            };
            document.head.appendChild(script);
        } else {
            console.log("Google Places script already exists");
        }
    }, [googleApiKey]);

    // Initialize autocomplete when API is loaded
    useEffect(() => {
        if (!isLoaded || !autocompleteRef.current) return;

        // Add a small delay to ensure the input is fully mounted
        const timeoutId = setTimeout(() => {
            if (!autocompleteRef.current) return;
            
            const autocomplete = new window.google.maps.places.Autocomplete(
                autocompleteRef.current,
                {
                    types: ['address'],
                    fields: ['address_components', 'formatted_address', 'geometry']
                }
            );

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (!place.address_components) return;

            const addressData: AddressData = {
                address_line_1: "",
                address_line_2: "",
                city: "",
                district: "",
                zip_code: "",
                country: ""
            };

            let streetNumber = "";
            let route = "";

            place.address_components.forEach((component: any) => {
                const componentType = component.types[0];

                switch (componentType) {
                    case 'street_number':
                        streetNumber = component.long_name;
                        break;
                    case 'route':
                        route = component.long_name;
                        break;
                    case 'subpremise':
                        addressData.address_line_2 = component.long_name;
                        break;
                    case 'locality':
                    case 'administrative_area_level_2':
                        addressData.city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        addressData.district = component.short_name;
                        break;
                    case 'postal_code':
                        addressData.zip_code = component.long_name;
                        break;
                    case 'country':
                        addressData.country = component.long_name;
                        break;
                }
            });

            // Brazilian format: Street name + number (e.g., "Rua Marques do Marica 920")
            if (route && streetNumber) {
                addressData.address_line_1 = `${route} ${streetNumber}`;
            } else if (route) {
                addressData.address_line_1 = route;
            } else if (streetNumber) {
                addressData.address_line_1 = streetNumber;
            }

            setAddress(addressData);
            onAddressSelect(addressData);
        });

            return () => {
                window.google?.maps?.event?.clearInstanceListeners(autocomplete);
            };
        }, 100); // Small delay
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [isLoaded, onAddressSelect]);

    const handleManualChange = useCallback((field: keyof AddressData, value: string) => {
        const updatedAddress = { ...address, [field]: value };
        setAddress(updatedAddress);
        onAddressSelect(updatedAddress);
    }, [address, onAddressSelect]);

    return (
        <div className={cn("w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg", className)}>
            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {labels.sectionTitle || "Address"}
            </h2>

            {/* Google Places Autocomplete Input */}
            <div className="flex flex-col gap-3">
                <Label htmlFor="autocomplete-address">
                    Search Address {required && "*"}
                </Label>
                <Input
                    ref={autocompleteRef}
                    id="autocomplete-address"
                    type="text"
                    placeholder="Type a complete address like 'Rua das Flores 123, São Paulo, SP'"
                    disabled={!isLoaded || disabled}
                    className={!isLoaded ? "bg-gray-100" : ""}
                />
                {!isLoaded && (
                    <p className="text-xs text-gray-500">Loading Google Places...</p>
                )}
            </div>

            {/* Manual Address Fields */}
            <div className="flex flex-col gap-3">
                <Label htmlFor="address_line_1">
                    {labels.addressLine1} {required && "*"}
                </Label>
                <Input
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    value={address.address_line_1}
                    onChange={(e) => handleManualChange('address_line_1', e.target.value)}
                    required={required}
                    disabled={disabled}
                />
            </div>

            <div className="flex flex-col gap-3">
                <Label htmlFor="address_line_2">
                    {labels.addressLine2}
                </Label>
                <Input
                    id="address_line_2"
                    name="address_line_2"
                    type="text"
                    value={address.address_line_2}
                    onChange={(e) => handleManualChange('address_line_2', e.target.value)}
                    disabled={disabled}
                />
            </div>

            <div className="w-full flex items-center gap-2">
                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="city">
                        {labels.city} {required && "*"}
                    </Label>
                    <Input
                        id="city"
                        name="city"
                        type="text"
                        value={address.city}
                        onChange={(e) => handleManualChange('city', e.target.value)}
                        required={required}
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="zip_code">
                        {labels.zipCode} {required && "*"}
                    </Label>
                    <Input
                        id="zip_code"
                        name="zip_code"
                        type="text"
                        value={address.zip_code}
                        onChange={(e) => handleManualChange('zip_code', e.target.value)}
                        required={required}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="w-full flex items-center gap-2">
                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="district">
                        {labels.state} {required && "*"}
                    </Label>
                    <Input
                        id="district"
                        name="district"
                        type="text"
                        value={address.district}
                        onChange={(e) => handleManualChange('district', e.target.value)}
                        required={required}
                        disabled={disabled}
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="country">
                        {labels.country} {required && "*"}
                    </Label>
                    <Input
                        id="country"
                        name="country"
                        type="text"
                        value={address.country}
                        onChange={(e) => handleManualChange('country', e.target.value)}
                        required={required}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}; 