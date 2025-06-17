# Backend Update Guide: Case Type → Service Types Migration

## 📋 OVERVIEW
**BREAKING CHANGE**: Converting single `case_type` field to multiple `service_types` array field

**Key Changes:**
- Field name: `case_type` → `service_types`
- Data type: `string` → `string[]` (array)
- Values: 11 old types → 62 new humanitarian service types
- Validation: Single required value → Array with minimum 1 item

---

## 🗄️ 1. DATABASE SCHEMA CHANGES

### **REQUIRED MIGRATION SCRIPT:**
```sql
-- Step 1: Add new service_types column
ALTER TABLE cases ADD COLUMN service_types TEXT[];

-- Step 2: Migrate existing data (convert case_type to service_types array)
UPDATE cases SET service_types = 
  CASE 
    WHEN case_type = 'HOUSING' THEN ARRAY['EMERGENCY_SHELTER_HOUSING']
    WHEN case_type = 'LEGAL' THEN ARRAY['LEGAL_AID_ASSISTANCE']
    WHEN case_type = 'MEDICAL' THEN ARRAY['HEALTHCARE_SERVICES']
    WHEN case_type = 'SUPPORT' THEN ARRAY['GENERAL_PROTECTION_SERVICES']
    WHEN case_type = 'EDUCATION' THEN ARRAY['EMERGENCY_EDUCATION_SERVICES']
    WHEN case_type = 'EMPLOYMENT' THEN ARRAY['JOB_PLACEMENT_EMPLOYMENT_SERVICES']
    WHEN case_type = 'FINANCIAL' THEN ARRAY['CVA']
    WHEN case_type = 'FAMILY_REUNIFICATION' THEN ARRAY['FAMILY_SEPARATION_REUNIFICATION']
    WHEN case_type = 'DOCUMENTATION' THEN ARRAY['CIVIL_DOCUMENTATION_SUPPORT']
    WHEN case_type = 'MENTAL_HEALTH' THEN ARRAY['MHPSS']
    WHEN case_type = 'OTHER' THEN ARRAY['GENERAL_PROTECTION_SERVICES']
    ELSE ARRAY['GENERAL_PROTECTION_SERVICES']
  END
WHERE case_type IS NOT NULL;

-- Step 3: Create index for performance
CREATE INDEX idx_cases_service_types ON cases USING GIN(service_types);

-- Step 4: Drop old case_type column (AFTER CONFIRMING MIGRATION SUCCESS)
-- ALTER TABLE cases DROP COLUMN case_type;
```

### **NEW SERVICE TYPES ENUM (62 Values):**
```sql
-- All 62 new service type values:
'CHILD_PROTECTION_CASE_MANAGEMENT'
'GBV_CASE_MANAGEMENT'
'GENERAL_PROTECTION_SERVICES'
'SEXUAL_VIOLENCE_RESPONSE'
'INTIMATE_PARTNER_VIOLENCE_SUPPORT'
'HUMAN_TRAFFICKING_RESPONSE'
'FAMILY_SEPARATION_REUNIFICATION'
'UASC_SERVICES'
'MHPSS'
'LEGAL_AID_ASSISTANCE'
'CIVIL_DOCUMENTATION_SUPPORT'
'EMERGENCY_SHELTER_HOUSING'
'NFI_DISTRIBUTION'
'FOOD_SECURITY_NUTRITION'
'CVA'
'WASH'
'HEALTHCARE_SERVICES'
'EMERGENCY_MEDICAL_CARE'
'SEXUAL_REPRODUCTIVE_HEALTH'
'DISABILITY_SUPPORT_SERVICES'
'EMERGENCY_EVACUATION'
'SEARCH_RESCUE_COORDINATION'
'RAPID_ASSESSMENT_NEEDS_ANALYSIS'
'EMERGENCY_REGISTRATION'
'EMERGENCY_TRANSPORTATION'
'EMERGENCY_COMMUNICATION_SERVICES'
'EMERGENCY_EDUCATION_SERVICES'
'CHILD_FRIENDLY_SPACES'
'SKILLS_TRAINING_VOCATIONAL_EDUCATION'
'LITERACY_PROGRAMS'
'AWARENESS_PREVENTION_CAMPAIGNS'
'LIVELIHOOD_SUPPORT_PROGRAMS'
'MICROFINANCE_CREDIT_SERVICES'
'JOB_PLACEMENT_EMPLOYMENT_SERVICES'
'AGRICULTURAL_SUPPORT'
'BUSINESS_DEVELOPMENT_SUPPORT'
'REFUGEE_SERVICES'
'IDP_SERVICES'
'RETURNEE_REINTEGRATION_SERVICES'
'HOST_COMMUNITY_SUPPORT'
'ELDERLY_CARE_SERVICES'
'SERVICES_FOR_PERSONS_WITH_DISABILITIES'
'CASE_REFERRAL_TRANSFER'
'INTER_AGENCY_COORDINATION'
'SERVICE_MAPPING_INFORMATION'
'FOLLOW_UP_MONITORING'
'CASE_CLOSURE_TRANSITION'
'BIRTH_REGISTRATION'
'IDENTITY_DOCUMENTATION'
'LEGAL_COUNSELING'
'COURT_SUPPORT_ACCOMPANIMENT'
'DETENTION_MONITORING'
'ADVOCACY_SERVICES'
'PRIMARY_HEALTHCARE'
'CLINICAL_MANAGEMENT_RAPE'
'HIV_AIDS_PREVENTION_TREATMENT'
'TUBERCULOSIS_TREATMENT'
'MALNUTRITION_TREATMENT'
'VACCINATION_PROGRAMS'
'EMERGENCY_SURGERY'
'CAMP_COORDINATION_MANAGEMENT'
'MINE_ACTION_SERVICES'
'PEACEKEEPING_PEACEBUILDING'
'LOGISTICS_TELECOMMUNICATIONS'
'INFORMATION_MANAGEMENT'
'COMMUNITY_MOBILIZATION'
'WINTERIZATION_SUPPORT'
```

---

## 🏗️ 2. API MODELS/ENTITIES TO UPDATE

### **Case Entity/Model:**
```typescript
// BEFORE:
interface Case {
  id: string;
  case_type: 'HOUSING' | 'LEGAL' | 'MEDICAL' | 'SUPPORT' | 'EDUCATION' | 'EMPLOYMENT' | 'FINANCIAL' | 'FAMILY_REUNIFICATION' | 'DOCUMENTATION' | 'MENTAL_HEALTH' | 'OTHER';
  // ... other fields
}

// AFTER:
interface Case {
  id: string;
  service_types: ServiceType[];
  // ... other fields
}

type ServiceType = 
  | 'CHILD_PROTECTION_CASE_MANAGEMENT'
  | 'GBV_CASE_MANAGEMENT'
  | 'GENERAL_PROTECTION_SERVICES'
  // ... all 62 service types
```

### **Request DTOs:**
```typescript
// CreateCaseRequest
interface CreateCaseRequest {
  title: string;
  description: string;
  service_types: ServiceType[]; // CHANGED FROM: case_type: ServiceType
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  // ... other fields
}

// UpdateCaseRequest  
interface UpdateCaseRequest {
  title?: string;
  description?: string;
  service_types?: ServiceType[]; // CHANGED FROM: case_type?: ServiceType
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  // ... other fields
}
```

### **Response DTOs:**
```typescript
// CaseResponse
interface CaseResponse {
  id: string;
  case_number: string;
  title: string;
  description: string;
  service_types: ServiceType[]; // CHANGED FROM: case_type: ServiceType
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  // ... other fields
}
```

---

## 🔗 3. API ENDPOINTS TO UPDATE

### **Cases CRUD:**
- `POST /cases` - Accept `service_types[]` instead of `case_type`
- `PUT /cases/:id` - Accept `service_types[]` instead of `case_type`
- `PATCH /cases/:id` - Accept `service_types[]` instead of `case_type`
- `GET /cases` - Return `service_types[]` instead of `case_type`
- `GET /cases/:id` - Return `service_types[]` instead of `case_type`

### **Filtering & Search:**
- `GET /cases?service_types=TYPE1,TYPE2,TYPE3` - Filter by multiple service types
- `GET /cases?service_types[]=TYPE1&service_types[]=TYPE2` - Alternative array syntax
- Update any case search/filtering logic to handle arrays

### **Statistics/Analytics:**
- `GET /cases/stats` - Update to handle multiple service types per case
- `GET /cases/stats/by-service-type` - May need to count cases multiple times if they have multiple service types
- Update any reporting endpoints that aggregate by case type

### **Organization Cases:**
- `GET /organizations/:id/cases` - Return `service_types[]` instead of `case_type`
- Update any organization-specific case filtering

---

## 🛡️ 4. VALIDATION UPDATES

### **Input Validation Schemas:**
```typescript
// BEFORE:
const createCaseSchema = {
  case_type: {
    required: true,
    enum: ['HOUSING', 'LEGAL', 'MEDICAL', 'SUPPORT', 'EDUCATION', 'EMPLOYMENT', 'FINANCIAL', 'FAMILY_REUNIFICATION', 'DOCUMENTATION', 'MENTAL_HEALTH', 'OTHER']
  }
}

// AFTER:
const createCaseSchema = {
  service_types: {
    required: true,
    type: 'array',
    minItems: 1,
    maxItems: 10, // reasonable limit
    items: {
      enum: [
        'CHILD_PROTECTION_CASE_MANAGEMENT',
        'GBV_CASE_MANAGEMENT',
        'GENERAL_PROTECTION_SERVICES',
        // ... all 62 service types
      ]
    }
  }
}
```

### **Business Logic Validation:**
- Ensure at least one service type is provided
- Validate all service types are from the allowed enum
- Remove duplicates from service_types array
- Consider any business rules about service type combinations

---

## 🔍 5. SEARCH & FILTERING LOGIC

### **Database Queries:**
```sql
-- BEFORE:
SELECT * FROM cases WHERE case_type = 'HOUSING';

-- AFTER:
SELECT * FROM cases WHERE 'EMERGENCY_SHELTER_HOUSING' = ANY(service_types);

-- Multiple service types:
SELECT * FROM cases WHERE service_types && ARRAY['EMERGENCY_SHELTER_HOUSING', 'HEALTHCARE_SERVICES'];

-- Contains all specified service types:
SELECT * FROM cases WHERE service_types @> ARRAY['EMERGENCY_SHELTER_HOUSING', 'HEALTHCARE_SERVICES'];
```

### **ORM/Query Builder Updates:**
- Update any ORM queries that filter by case_type
- Update any joins that use case_type
- Update any aggregation queries that group by case_type

---

## 📊 6. STATISTICS & REPORTING

### **Analytics Updates:**
- **Case count by service type:** Handle cases being counted multiple times (one case can have multiple service types)
- **Service type distribution:** Calculate percentage based on total occurrences vs total cases
- **Most common service type combinations:** Track which service types are frequently used together

### **Dashboard/Metrics:**
- Update any dashboards that show case type breakdowns
- Update KPI calculations that depend on case types
- Update any charts/graphs that visualize case type data

---

## 🧪 7. TESTING REQUIREMENTS

### **Unit Tests:**
- [ ] Test case creation with single service type
- [ ] Test case creation with multiple service types
- [ ] Test case update with service types
- [ ] Test validation with empty service_types array (should fail)
- [ ] Test validation with invalid service type (should fail)
- [ ] Test validation with duplicate service types (should deduplicate)

### **Integration Tests:**
- [ ] Test filtering cases by single service type
- [ ] Test filtering cases by multiple service types
- [ ] Test case statistics with new service types
- [ ] Test case search functionality
- [ ] Test data migration script

### **API Tests:**
- [ ] Test all CRUD endpoints with new service_types field
- [ ] Test backwards compatibility during migration period
- [ ] Test error responses for invalid service types

---

## 🚨 8. BREAKING CHANGES & DEPLOYMENT

### **API Contract Changes:**
- **Field name change:** `case_type` → `service_types`
- **Data type change:** `string` → `string[]`
- **Validation change:** Single required value → Array with min 1 item

### **Deployment Strategy:**
1. **Phase 1:** Deploy backend changes with both fields supported (backwards compatibility)
2. **Phase 2:** Update frontend to use new service_types field
3. **Phase 3:** Run data migration script
4. **Phase 4:** Remove old case_type field support

### **Client Update Required:**
All API clients must update to:
- Send `service_types` array instead of `case_type` string
- Handle `service_types` array in responses
- Update any filtering logic for multiple service types

---

## 📝 9. DOCUMENTATION UPDATES

### **API Documentation:**
- [ ] Update OpenAPI/Swagger specs
- [ ] Update field descriptions and examples
- [ ] Add new service type enum values
- [ ] Update error response examples
- [ ] Add migration guide for API consumers

### **Database Documentation:**
- [ ] Update ERD diagrams
- [ ] Document new service_types field
- [ ] Update data dictionaries
- [ ] Document indexes and performance considerations

---

## ✅ 10. IMPLEMENTATION CHECKLIST

### **Database:**
- [ ] Create migration script
- [ ] Test migration on staging data
- [ ] Create performance indexes
- [ ] Backup production data before migration

### **Backend Code:**
- [ ] Update all entity/model definitions
- [ ] Update all DTO/request/response interfaces
- [ ] Update validation schemas
- [ ] Update all API endpoints
- [ ] Update search/filtering logic
- [ ] Update statistics/reporting logic

### **Testing:**
- [ ] Write unit tests for new validation
- [ ] Write integration tests for API endpoints
- [ ] Test data migration script
- [ ] Performance test with new indexes

### **Documentation:**
- [ ] Update API documentation
- [ ] Update database schema documentation
- [ ] Create migration guide for API consumers
- [ ] Update any technical specifications

### **Deployment:**
- [ ] Plan phased deployment strategy
- [ ] Coordinate with frontend team
- [ ] Plan rollback strategy
- [ ] Monitor system after deployment

---

## 🔄 11. ROLLBACK PLAN

### **If Issues Arise:**
1. **Keep old case_type column** during initial deployment
2. **Revert API endpoints** to use case_type if needed
3. **Database rollback:** Copy data back from service_types to case_type
4. **Frontend rollback:** Switch back to case_type field

### **Rollback Script:**
```sql
-- Emergency rollback (if service_types has single values)
UPDATE cases SET case_type = service_types[1] WHERE array_length(service_types, 1) = 1;

-- For cases with multiple service types, choose primary one or set to 'OTHER'
UPDATE cases SET case_type = 'OTHER' WHERE array_length(service_types, 1) > 1;
```

---

**This document covers ALL backend changes required for the service types migration. Please review each section and confirm implementation approach before proceeding.** 