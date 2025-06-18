# Backend: Emergency Contact Multiple & Optional Implementation Guide

## Frontend Changes Summary
- Users can now skip emergency contact entirely via checkbox
- Users can add multiple emergency contacts (1 or more)
- When skipped: sends `emergency_contacts: []`
- When used: sends array with 1+ emergency contact objects

## Step 1: Update API Validation Schema
Make emergency_contacts optional and allow multiple contacts:

```javascript
const beneficiarySchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  emergency_contacts: Joi.array().items(emergencyContactSchema).default([]).optional(),
  // Other fields...
});

const emergencyContactSchema = Joi.object({
  full_name: Joi.string().required(),
  relationship: Joi.string().required(),
  phones: Joi.array().items(Joi.string()).default([]),
  emails: Joi.array().items(Joi.string().email()).default([])
});
```

## Step 2: Update Create Beneficiary Function
Only validate emergency contacts if array is not empty:

```javascript
async function createBeneficiary(data) {
  // Validate only if emergency contacts are provided
  if (data.emergency_contacts && data.emergency_contacts.length > 0) {
    data.emergency_contacts.forEach((contact, index) => {
      if (!contact.full_name || !contact.relationship) {
        throw new Error(`Emergency contact ${index + 1}: Missing required fields`);
      }
      if (!contact.phones || contact.phones.length === 0) {
        throw new Error(`Emergency contact ${index + 1}: Phone number required`);
      }
      if (!contact.emails || contact.emails.length === 0) {
        throw new Error(`Emergency contact ${index + 1}: Email required`);
      }
    });
  }

  // Create beneficiary with emergency_contacts array (can be empty)
  const beneficiary = await Beneficiary.create({
    ...data,
    emergency_contacts: data.emergency_contacts || []
  });

  return beneficiary;
}
```

## Step 3: Update Database Schema
Ensure your database allows empty arrays:

```javascript
// MongoDB/Mongoose
const beneficiarySchema = new Schema({
  full_name: { type: String, required: true },
  emergency_contacts: {
    type: [{
      full_name: { type: String, required: true },
      relationship: { type: String, required: true },
      phones: [String],
      emails: [String]
    }],
    default: [] // Allow empty array
  }
});

// SQL equivalent
emergency_contacts_json JSON DEFAULT '[]'
```

## Step 4: Update Read/Display Logic
Handle empty emergency contacts gracefully:

```javascript
function formatBeneficiaryForDisplay(beneficiary) {
  return {
    ...beneficiary,
    has_emergency_contacts: beneficiary.emergency_contacts.length > 0,
    emergency_contact_count: beneficiary.emergency_contacts.length,
    emergency_contacts: beneficiary.emergency_contacts || []
  };
}
```

## Step 5: Update Search/Filter Logic
Consider cases where emergency contacts might be empty:

```javascript
// When searching by emergency contact
function searchByEmergencyContact(query) {
  return Beneficiary.find({
    'emergency_contacts.full_name': { $regex: query, $options: 'i' },
    'emergency_contacts.0': { $exists: true } // Ensure array is not empty
  });
}
```

## Testing Checklist
- [ ] Can create beneficiary with no emergency contacts
- [ ] Can create beneficiary with 1 emergency contact
- [ ] Can create beneficiary with multiple emergency contacts
- [ ] Validation fails only when emergency contacts are provided but incomplete
- [ ] Database stores empty array correctly
- [ ] API returns empty array correctly 