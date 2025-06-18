# Google Places Address Autocomplete Integration Guide

## Overview
This guide explains how to integrate Google Places API address autocomplete functionality into the Relif platform forms. The implementation provides both automatic address completion and manual entry options.

## Setup

### 1. Google API Key Configuration

First, you need to add your Google Places API key to the environment variables:

```bash
# Create or update .env.local file
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key_here
```

### 2. Enable Required APIs

Make sure the following Google APIs are enabled in your Google Cloud Console:
- **Places API (New)** - For address autocomplete
- **Maps JavaScript API** - For map services
- **Geocoding API** - For address geocoding

### 3. API Key Restrictions (Recommended)

In Google Cloud Console, restrict your API key:
- **Application restrictions**: HTTP referrers (web sites)
- **Website restrictions**: Add your domains (e.g., `*.relifaid.org/*`, `localhost:3000/*`)
- **API restrictions**: Limit to Places API, Maps JavaScript API, and Geocoding API

## Components

### 1. AddressAutocomplete Component

**Location**: `src/components/ui/address-autocomplete.tsx`

**Features**:
- Google Places autocomplete search field
- Automatic population of address fields
- Manual editing capability
- Customizable labels and styling
- Form validation support
- TypeScript support

**Props**:
```typescript
interface AddressAutocompleteProps {
    onAddressSelect: (address: AddressData) => void;
    defaultValues?: Partial<AddressData>;
    googleApiKey: string;
    className?: string;
    labels?: {
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
```

### 2. useGooglePlaces Hook

**Location**: `src/hooks/useGooglePlaces.tsx`

**Purpose**: Manages Google Places API configuration and readiness state.

**Returns**:
```typescript
{
    apiKey: string;
    isReady: boolean;
}
```

## Integration Steps

### Step 1: Import Components

```typescript
import { AddressAutocomplete, AddressData } from "@/components/ui/address-autocomplete";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
```

### Step 2: Add State Management

```typescript
const { apiKey, isReady } = useGooglePlaces();
const [addressData, setAddressData] = useState<AddressData | null>(null);
```

### Step 3: Replace Existing Address Section

Replace your current address input fields with:

```tsx
{isReady ? (
    <AddressAutocomplete
        googleApiKey={apiKey}
        onAddressSelect={setAddressData}
        labels={{
            addressLine1: dict.commons.beneficiaries.create.addressLine + " 1",
            addressLine2: dict.commons.beneficiaries.create.addressLine + " 2",
            city: dict.commons.beneficiaries.create.city,
            state: dict.commons.beneficiaries.create.state,
            zipCode: dict.commons.beneficiaries.create.postalCode,
            country: dict.commons.beneficiaries.create.country
        }}
        required={true}
        defaultValues={existingAddress} // For edit forms
    />
) : (
    <div className="p-4 text-gray-500">
        Google Places API not configured. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your environment variables.
    </div>
)}
```

### Step 4: Update Form Submission

```typescript
const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Add address data from autocomplete
    if (addressData) {
        formData.append('address_line_1', addressData.address_line_1);
        formData.append('address_line_2', addressData.address_line_2);
        formData.append('city', addressData.city);
        formData.append('district', addressData.district);
        formData.append('zip_code', addressData.zip_code);
        formData.append('country', addressData.country);
    }
    
    // Submit form...
};
```

## Files to Update

Apply this integration to the following form files:

### Beneficiaries
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/create/form.layout.tsx`
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/[beneficiary_id]/(withoutLayout)/edit/form.layout.tsx`

### Volunteers
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/volunteers/create/form.layout.tsx`
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/volunteers/[volunteer_id]/edit/form.layout.tsx`

### Housings
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/housings/create/form.layout.tsx`
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/housings/[housing_id]/edit/form.layout.tsx`

### Organizations
- `src/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/overview/form.layout.tsx`
- `src/app/[lang]/(pages)/app/entry/createOrganization.layout.tsx`

## Address Data Structure

The component returns data in this format:

```typescript
interface AddressData {
    address_line_1: string;  // Street number + route
    address_line_2: string;  // Apartment, suite, etc.
    city: string;           // City/locality
    district: string;       // State/province (short name)
    zip_code: string;       // Postal/ZIP code
    country: string;        // Country (long name)
}
```

## How It Works

1. **User types in search field**: Google Places API provides autocomplete suggestions
2. **User selects an address**: Component parses the place data and populates all address fields
3. **Manual editing**: Users can modify any field manually after autocomplete
4. **Form integration**: Address data is passed to parent component via `onAddressSelect` callback

## Fallback Behavior

- **No API key**: Shows manual input fields only with a message
- **API load failure**: Gracefully falls back to manual entry
- **No autocomplete results**: Users can still enter addresses manually

## Styling

The component uses the existing Relif design system:
- Consistent with current form styling
- Orange-themed borders (`border-relif-orange-200`)
- Proper spacing and typography
- Responsive design

## Testing

To test the integration:

1. Set up your Google API key
2. Navigate to any form with address fields
3. Start typing an address in the search field
4. Select a suggestion and verify all fields populate correctly
5. Test manual editing of the populated fields
6. Submit the form and verify address data is included

## Cost Considerations

Google Places API pricing:
- **Autocomplete**: $2.83 per 1,000 requests
- **Place Details**: $17 per 1,000 requests

The component is optimized to minimize API calls by only making requests when users interact with the autocomplete field.

## Security Notes

- API key is public (NEXT_PUBLIC_*) but should be restricted by domain
- Never commit API keys to version control
- Use environment variables for different environments (dev, staging, prod)
- Monitor API usage in Google Cloud Console

## Browser Support

- Chrome, Firefox, Safari, Edge (all modern versions)
- Requires JavaScript enabled
- Works on mobile devices
- Graceful degradation on older browsers 