# Beneficiary Status Update API Specification

## Overview
This document outlines the required backend API changes to support beneficiary status management in the frontend application.

## Current Status
The frontend has been updated to include beneficiary status change functionality, but requires backend API support to function properly.

## Required API Endpoint

### PUT `/beneficiaries/{beneficiaryId}/status`

Updates the status of a specific beneficiary.

#### Request

**Method:** `PUT`
**Path:** `/beneficiaries/{beneficiaryId}/status`
**Content-Type:** `application/json`

**Path Parameters:**
- `beneficiaryId` (string, required): The unique identifier of the beneficiary

**Request Body:**
```json
{
  "status": "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED"
}
```

**Request Body Schema:**
```typescript
interface UpdateBeneficiaryStatusRequest {
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED";
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "id": "beneficiary-uuid",
  "status": "ACTIVE",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "updated_by": "user-uuid"
}
```

**Response Schema:**
```typescript
interface UpdateBeneficiaryStatusResponse {
  id: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED";
  updated_at: string; // ISO 8601 format
  updated_by: string; // ID of user who made the change
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "INVALID_STATUS",
  "message": "Invalid status value. Must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED",
  "code": 400
}
```

**403 Forbidden:**
```json
{
  "error": "INSUFFICIENT_PERMISSIONS",
  "message": "You don't have permission to change beneficiary status",
  "code": 403
}
```

**404 Not Found:**
```json
{
  "error": "BENEFICIARY_NOT_FOUND",
  "message": "Beneficiary with the specified ID was not found",
  "code": 404
}
```

**422 Unprocessable Entity:**
```json
{
  "error": "INVALID_STATUS_TRANSITION",
  "message": "Cannot change status from ARCHIVED to ACTIVE",
  "code": 422
}
```

### POST `/beneficiaries` (Update Required)

**Important**: The create beneficiary endpoint should also support setting initial status.

**Request Body Enhancement:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  // ... other beneficiary fields ...
  "status": "ACTIVE" | "PENDING" | "INACTIVE" | "ARCHIVED" // Optional, defaults to "ACTIVE"
}
```

**Frontend Usage:**
- When "Requires Review" checkbox is checked → `status: "PENDING"`
- When "Requires Review" checkbox is unchecked → `status: "ACTIVE"`
- If not provided in request → Backend defaults to `"ACTIVE"`

## Status Definitions

| Status | Description | Business Rules |
|--------|-------------|----------------|
| `ACTIVE` | Beneficiary is actively receiving services | Default status for new beneficiaries |
| `INACTIVE` | Beneficiary is temporarily not receiving services | Can be reactivated |
| `PENDING` | Beneficiary is awaiting approval or processing | Typically for new registrations |
| `ARCHIVED` | Beneficiary record is archived and no longer active | Cannot be changed to other statuses |

## Business Rules & Validation

### Status Transition Rules
1. **PENDING → ACTIVE**: ✅ Allowed (approval process)
2. **PENDING → INACTIVE**: ✅ Allowed (rejection/suspension)
3. **PENDING → ARCHIVED**: ✅ Allowed (permanent rejection)
4. **ACTIVE → INACTIVE**: ✅ Allowed (temporary suspension)
5. **ACTIVE → ARCHIVED**: ✅ Allowed (permanent closure)
6. **INACTIVE → ACTIVE**: ✅ Allowed (reactivation)
7. **INACTIVE → ARCHIVED**: ✅ Allowed (permanent closure)
8. **ARCHIVED → Any**: ❌ **NOT ALLOWED** (archived is final)

### Permission Requirements
- **ORG_ADMIN**: Can change status of beneficiaries in their organization
- **ORG_USER**: Cannot change beneficiary status
- **PLATFORM_ADMIN**: Can change status of any beneficiary

### Audit Requirements
- All status changes must be logged with:
  - Previous status
  - New status
  - User who made the change
  - Timestamp
  - Optional reason/comment

## Database Changes Required

### Beneficiaries Table
Ensure the `status` column exists and has the correct constraints:

```sql
ALTER TABLE beneficiaries 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING' 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'));

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
```

### Audit Table (Recommended)
Create an audit table to track status changes:

```sql
CREATE TABLE IF NOT EXISTS beneficiary_status_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    organization_id UUID NOT NULL REFERENCES organizations(id)
);

CREATE INDEX idx_beneficiary_status_audit_beneficiary ON beneficiary_status_audit(beneficiary_id);
CREATE INDEX idx_beneficiary_status_audit_changed_at ON beneficiary_status_audit(changed_at);
```

## Frontend Integration

### API Client Function
The frontend includes this function that expects the above API:

```typescript
export async function updateBeneficiaryStatus(
    beneficiaryId: string,
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED"
): Promise<AxiosResponse> {
    return client.request({
        url: `beneficiaries/${beneficiaryId}/status`,
        method: "PUT",
        data: { status },
        headers: {
            "Content-Type": "application/json",
        },
    });
}
```

### UI Components Added
1. **StatusModal**: Dialog for changing beneficiary status
2. **Status buttons**: In beneficiary card dropdown and detail toolbar
3. **Status badges**: Color-coded status display in beneficiary cards
4. **Permission checks**: Only ORG_ADMIN users see status change options

## Testing Requirements

### Unit Tests
- Validate status transition rules
- Test permission checks
- Verify audit logging
- Test error responses

### Integration Tests
- End-to-end status change workflow
- Permission-based access control
- Database consistency checks
- API response validation

### Test Cases

#### Valid Status Changes
```bash
# Test PENDING → ACTIVE
PUT /beneficiaries/123/status
{"status": "ACTIVE"}
Expected: 200 OK

# Test ACTIVE → INACTIVE  
PUT /beneficiaries/123/status
{"status": "INACTIVE"}
Expected: 200 OK
```

#### Invalid Status Changes
```bash
# Test ARCHIVED → ACTIVE (should fail)
PUT /beneficiaries/123/status
{"status": "ACTIVE"}
Expected: 422 Unprocessable Entity

# Test invalid status value
PUT /beneficiaries/123/status
{"status": "INVALID"}
Expected: 400 Bad Request
```

#### Permission Tests
```bash
# Test ORG_USER trying to change status (should fail)
PUT /beneficiaries/123/status
{"status": "ACTIVE"}
Expected: 403 Forbidden
```

## Migration Strategy

### Phase 1: Database Setup
1. Add status column with default values
2. Create audit table
3. Set existing beneficiaries to appropriate status

### Phase 2: API Implementation
1. Implement the status update endpoint
2. Add permission checks
3. Implement audit logging

### Phase 3: Testing & Deployment
1. Run comprehensive tests
2. Deploy to staging environment
3. Validate frontend integration
4. Deploy to production

## Security Considerations

1. **Authorization**: Verify user has permission to modify beneficiary
2. **Organization Scope**: Users can only modify beneficiaries in their organization
3. **Audit Trail**: All changes must be logged for compliance
4. **Rate Limiting**: Prevent abuse of status change API
5. **Input Validation**: Strict validation of status values

## Performance Considerations

1. **Database Indexes**: Ensure proper indexing on status column
2. **Caching**: Consider caching beneficiary counts by status
3. **Batch Operations**: Consider adding bulk status update endpoint for admin operations

## Monitoring & Alerting

1. **Status Change Frequency**: Monitor unusual patterns in status changes
2. **Failed Requests**: Track 403/422 errors for security monitoring
3. **Performance Metrics**: Monitor API response times
4. **Data Integrity**: Periodic checks for orphaned audit records

## Documentation Updates Required

1. Update API documentation with new endpoint
2. Update user manual with status change procedures
3. Update permission matrix documentation
4. Create troubleshooting guide for status issues

---

## Summary

This specification provides all the necessary information to implement beneficiary status management in the backend. The frontend is ready and waiting for the API implementation. Once the backend changes are deployed, users will be able to:

- Change beneficiary status through an intuitive UI
- View status with color-coded badges
- Track all status changes through audit logs
- Maintain proper permissions and security

**Priority**: High - Required for production deployment
**Estimated Backend Development Time**: 2-3 days
**Dependencies**: Database migration, permission system updates 