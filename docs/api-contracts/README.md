# API Contract Documentation

This directory contains the API contract specifications for the Kreativibe platform. These contracts define the expected request/response formats for all backend API endpoints.

## Purpose

These contracts serve as:
1. **Frontend Development Guide** - TypeScript types are already defined in `src/types/api-contracts/`
2. **Backend Team Reference** - Clear specifications for implementing API endpoints
3. **Integration Checklist** - Validation that frontend and backend are aligned

## Contract Files

### Authentication & User Management
- `auth.md` - Authentication endpoints (login, signup, 2FA, password reset)
- `users.md` - User management and profile endpoints

### Country & Configuration
- `countries.md` - Country management and configuration
- `config.md` - System configuration endpoints

### Creative Features
- `kyc.md` - KYC verification and validation
- `wallet.md` - Wallet and transaction management
- `withdrawals.md` - Withdrawal requests and processing
- `content.md` - Content upload and management

### Brand Features
- `brand.md` - Brand verification and management
- `purchases.md` - Purchase history and transactions
- `social.md` - Social media account integration
- `analytics.md` - Campaign analytics and reporting

### Admin Features
- `admin.md` - Admin operations and oversight

## Contract Format

Each contract file follows this structure:

```markdown
## Endpoint Name

**Method:** GET/POST/PUT/DELETE  
**Path:** `/api/endpoint/path`  
**Auth Required:** Yes/No  
**Roles:** CREATOR, BRAND, ADMIN, SUPPORT_AGENT

### Request

**Headers:**
- Authorization: Bearer {token}
- Content-Type: application/json

**Query Parameters:** (for GET requests)
- param1: type - description
- param2: type - description

**Body:** (for POST/PUT requests)
```json
{
  "field1": "type",
  "field2": "type"
}
```

### Response

**Success (200/201):**
```json
{
  "field1": "type",
  "field2": "type"
}
```

**Error Responses:**
- 400 Bad Request - Invalid input
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error
```

## TypeScript Types

All request/response types are defined in `src/types/api-contracts/`. The backend team should ensure their API responses match these TypeScript interfaces exactly.

## Mock Data

Mock data generators are available in `src/lib/mock-data/generators.ts` for testing and development.

## Integration Checklist

Before going live:
- [ ] All endpoints return data matching TypeScript types
- [ ] Error responses follow standard format
- [ ] Authentication headers are validated
- [ ] Role-based access control is enforced
- [ ] Pagination is implemented where specified
- [ ] File uploads work with multipart/form-data
- [ ] OAuth callbacks are properly configured
