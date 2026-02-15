# Factify Hackathon Guide

This guide has two parts: **Part 1** covers every Factify API endpoint your application can call, and **Part 2** defines the Factify Design System for styling your UI.

---

## What is Factify?

Factify is a document infrastructure platform that enables **safe, controlled document sharing**. Instead of emailing raw PDFs, users upload documents to Factify and share them through secure links with fine grained access control.

Key capabilities:

- **Access policies**: Attach policies to documents that gate access. For example, a **lead generation wall** requires viewers to fill out a contact form before they can see the document content.
- **Role based permissions**: A five tier role hierarchy (Viewer, Commenter, Collaborator, Admin, Owner) controls what each user can do with a document.
- **Document analytics**: Track who viewed a document, how long they spent on each page, referral sources, and more.
- **Clear ownership**: Every document has an explicit owner and an audit timeline that records all access, sharing, and modification events.
- **AI chat**: Built in AI assistant that can answer questions about a document's content.

### Document Viewing

Applications built on Factify should **not** embed or interact with the document viewer directly. Instead, direct users to view documents on the Factify hosted viewer at `d.factify.com`.

**Single version document:**

```
https://d.factify.com/documents/{document_id}
```

Example: `https://d.factify.com/documents/0198c27d-24e8-7911-999b-bd9b1f65856c`

**Specific version of a multi version document:**

```
https://d.factify.com/documents/{document_id}/versions/{version_id}
```

Example: `https://d.factify.com/documents/019a972d-af84-7584-9436-2e8e47c7bc56/versions/019a972e-3243-7653-9cf0-d6e5d388ea87`

Your application manages documents through the API (upload, share, attach policies, read analytics) and sends users to these URLs to actually view the content. There are no iframes or embedded viewers.

---

# Part 1: Factify API

> **Note on SDK vs Raw API:** This guide documents the raw HTTP endpoints (REST and ConnectRPC). While there is a Factify SDK (see Quickstart), for this hackathon we recommend using the raw API endpoints documented below to ensure you have access to the latest features.

**Base URLs:**

| Protocol | Base URL |
|----------|----------|
| v1beta REST | `https://api.factify.com` |
| v1alpha ConnectRPC | `https://rpc.factify.com` |

**Auth header for every request (both protocols):**

```
Authorization: Bearer <token>
```

**REST example:**

```bash
curl -X GET "https://api.factify.com/v1beta/documents" \
  -H "Authorization: Bearer <token>"
```

> **Note:** Some REST v1beta endpoints (including `GET /v1beta/documents`) may return HTTP 403 with standard tokens. If this happens, use the equivalent ConnectRPC endpoint as a fallback.

> **TESTED 2026 02 10: ALL v1beta REST endpoints are blocked by Cloudflare challenge pages when called from server side code or curl. This is not just a 403; the response is an HTML challenge page. Use ConnectRPC v1alpha endpoints exclusively for all server side and programmatic access. Every API call should be a POST to `https://rpc.factify.com`.**

**ConnectRPC example:**

```bash
curl -X POST "https://rpc.factify.com/api.document.v1alpha.SharingService/ListDocumentAccess" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"document_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

## Sign In Flow

Every app starts with a sign in screen where the user pastes their Factify token.

1. Show a single text input labeled "Paste your Factify token (with or without the Bearer prefix)" and a "Sign In" button.

> **Important:** Users may paste the token with or without the `Bearer ` prefix. Your app should normalize the input by stripping any leading `Bearer ` and storing only the raw token string.
>
> Example:
>
> ```js
> const cleanToken = rawToken.replace(/^Bearer\s+/i, "").trim();
> // Use: Authorization: Bearer ${cleanToken}
> ```

2. Store the normalized token in memory or local storage.
3. Call **Get Current User** (below) to validate the token. If it returns 200, the user is authenticated. If 401, show an error.
4. Extract user info (email, organization) from the response. No need to ask for email separately.
5. Attach the normalized token to every subsequent API call via `Authorization: Bearer <token>`.

### Get Current User

This is a ConnectRPC endpoint. Use base URL `https://rpc.factify.com`.

```
POST https://rpc.factify.com/api.dal.v1alpha.UserService/GetCurrentUser
Content-Type: application/json
Body: {}
```

**Response:**

```json
{
  "userAccount": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a550",
    "email": "jane.doe@company.com",
    "user": {
      "id": "019346c5-0cf2-7817-d18e-44eda2836070"
    },
    "organization": {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "name": "my-org",
      "displayName": "My Organization"
    },
    "accountType": "ACCOUNT_TYPE_USER_ACCOUNT"
  }
}
```

| Field | Description |
|-------|-------------|
| `userAccount.id` | Unique user ID |
| `userAccount.email` | User email |
| `userAccount.user.id` | User profile ID |
| `userAccount.organization.id` | Organization ID |
| `userAccount.organization.name` | Organization slug |
| `userAccount.organization.displayName` | Organization display name |
| `userAccount.accountType` | Account type enum (e.g. `ACCOUNT_TYPE_USER_ACCOUNT`) |

---

## Pagination

List endpoints use one of the following pagination styles depending on the protocol and service:

### v1beta REST endpoints

Use `page_size` (integer, 1 to 100, default 50) and `page_token` (string) as query parameters. Responses include `pagination.next_page_token`, `pagination.prev_page_token`, and `pagination.has_more`. Pass `next_page_token` as `page_token` to fetch the next page. Stop when `has_more` is `false`.

### v1alpha ConnectRPC endpoints (most services)

Use `cursor` (string) and `page_size` (integer) in the JSON request body. Responses include `next_cursor`. Pass `next_cursor` as `cursor` in the next request. Stop when `next_cursor` is empty. This style is used by Access Policies, Access Requests, Session Metrics, Form Submissions, Timeline, and other ConnectRPC services.

### Number based pagination (Notifications)

Some endpoints (such as Notifications) use `current_page` (1 indexed integer) and `page_size` in the request body, with `total_count` in the response.

### DAL v1alpha pagination (DocumentService, SharingService)

Some DAL v1alpha endpoints use a `pagination` wrapper object with `page` (1 indexed integer) and `pageSize` (integer) in the JSON request body:

```json
{
  "pagination": { "page": 1, "pageSize": 20 }
}
```

> **TESTED 2026 02 10: The above format does NOT work for `ListDocuments`. The actual working format uses snake_case fields:**
>
> ```json
> {"pagination": {"current_page": 1, "page_size": 20}}
> ```
>
> Using `page` / `pageSize` results in validation error: `pagination.current_page: value must be greater than or equal to 1`. Test each DAL endpoint individually as the field names may vary.

**TypeScript Interface:**

```typescript
// As documented (may not work for all DAL endpoints):
interface DalPagination {
  pagination: {
    page: number;     // 1-indexed
    pageSize: number; // default 20
  }
}

// Tested working format for ListDocuments:
interface DalPaginationActual {
  pagination: {
    current_page: number;  // 1-indexed
    page_size: number;     // default 20
  }
}
```

Note: these fields use **camelCase** (`pageSize`), unlike most other endpoints which use **snake_case** (`page_size`). However, testing shows that at least `ListDocuments` actually uses snake_case (`current_page`, `page_size`).

### Summary (pagination field conventions)

| Style | Fields | Casing | Used by |
|-------|--------|--------|---------|
| REST v1beta | `page_size`, `page_token` | snake_case query params | Documents, Versions, Organizations |
| ConnectRPC cursor | `page_size`, `cursor` | snake_case body fields | Most ConnectRPC services (Access Policies, Metrics, Forms, Timeline) |
| Number based | `current_page`, `page_size` | snake_case body fields | Notifications |
| DAL services | `pagination.page`, `pagination.pageSize` | camelCase nested object | DAL v1alpha services (DocumentService, SharingService) |

Each endpoint section below specifies which pagination style it uses.

---

## Errors

Error responses differ slightly between the two protocols but share the same top level structure. There is **no** `error` wrapper object; fields are at the root.

**v1beta REST errors:**

```json
{
  "code": "unauthenticated",
  "message": "Invalid authentication token",
  "details": [
    { "reason": "invalid_field_value", "request_id": "req_abc123" }
  ]
}
```

> **Note:** The `reason` values vary by endpoint and context. Known patterns include `invalid_field_value`, `missing_required_field`, and others. The exact set of reason values is not fully enumerated.

**v1alpha ConnectRPC errors:**

```json
{
  "code": "invalid_argument",
  "message": "validation failed: document_id is required",
  "details": [
    {
      "type": "base.v1beta.ErrorDetails",
      "value": "...",
      "debug": {
        "reason": "ERROR_REASON_INVALID_FIELD_VALUE",
        "request_id": "req_abc123"
      }
    }
  ]
}
```

| HTTP Status | `code` | Meaning |
|-------------|--------|---------|
| 400 | `invalid_argument` | Bad parameters or missing fields |
| 401 | `unauthenticated` | Missing or invalid token |
| 403 | `permission_denied` | Insufficient permissions |
| 404 | `not_found` | Resource does not exist |
| 429 | `resource_exhausted` | Too many requests |
| 500 | `internal` | Internal server error |
| 501 | `unimplemented` | Endpoint exists but has no server implementation |

---

## ID Formats

Factify uses **two different ID formats** depending on the protocol:

### v1alpha ConnectRPC (UUIDs)

All v1alpha ConnectRPC endpoints return standard UUIDs in responses:

```
019c42ce-f2c7-74aa-8f41-c5aabe92a552
```

### v1beta REST (Prefixed IDs)

All v1beta REST endpoints use prefixed IDs with strict regex patterns:

| Prefix | Pattern | Example |
|--------|---------|---------|
| `doc_` | `^doc_[0-9a-hjkmnp-tv-z]{26}$` | `doc_01h2xcejqtf2nbrexx3vqjhp41` |
| `org_` | `^org_[0-9a-hjkmnp-tv-z]{26}$` | `org_01h2xcejqtf2nbrexx3vqjhp41` |
| `ver_` | `^ver_[0-9a-hjkmnp-tv-z]{26}$` | `ver_01h2xcejqtf2nbrexx3vqjhp41` |
| `key_` | `^key_[0-9a-hjkmnp-tv-z]{26}$` | `key_01h2xcejqtf2nbrexx3vqjhp41` |

> **Important:** Standard UUIDs returned by v1alpha endpoints are **rejected by v1beta** with HTTP 400. Developers must be aware of this mapping gap when mixing protocols. If your workflow calls v1alpha to get an ID and then passes it to a v1beta endpoint (or vice versa), the call will fail.

---

## Rate Limits

The API enforces the following rate limits per token:

| Verb | Limit |
|------|-------|
| GET requests | 1,000 per minute |
| POST requests | 100 per minute |

> **Note:** The API does not currently return rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) in any response. Implement client side throttling based on the limits above without relying on response headers.

> **Hackathon tip:** if you are doing bulk operations (for example, sharing a document with every contact in a CRM list), plan for the 100 POST/min ceiling. A simple `sleep` or token bucket on the client side will keep you under the limit.

---

## File Upload Constraints

| Constraint | Value |
|------------|-------|
| Accepted file format | PDF only |
| Maximum file size | 100 MB |

---

## Calling Conventions

The Factify API exposes endpoints through two protocols. Each protocol uses a **different base URL**, but both use the same `Authorization: Bearer <token>` header.

| Protocol | Base URL | Used for |
|----------|----------|----------|
| v1beta REST | `https://api.factify.com` | Documents, Versions, Organizations, API Keys, Policies (REST) |
| v1alpha ConnectRPC | `https://rpc.factify.com` | Sharing, Access Policies, Annotations, Comments, Forms, Metrics, Chat, Timeline, Identity, Notifications, Actions, Cover Pages, and all other ConnectRPC services |

### v1beta REST

Base URL: `https://api.factify.com`

Standard HTTP verbs at `/v1beta/...` paths. These are the endpoints documented below for Documents, Versions, Organizations, API Keys, and Policies.

```
GET    https://api.factify.com/v1beta/documents
POST   https://api.factify.com/v1beta/documents
PATCH  https://api.factify.com/v1beta/documents/{document_id}
DELETE https://api.factify.com/v1beta/documents/{document_id}/policies/{policy_id}
```

### v1alpha ConnectRPC

Base URL: `https://rpc.factify.com`

All requests use `POST` with `Content-Type: application/json`. The path follows the pattern `/<package>.<ServiceName>/<MethodName>`. The request body is always a JSON object matching the protobuf request message.

```
POST https://rpc.factify.com/api.document.v1alpha.SharingService/GrantDocumentAccess
Content-Type: application/json
Authorization: Bearer <token>

{
  "document_id": "...",
  "recipients": [...]
}
```

The response is also a JSON object. Server streaming RPCs (such as `StreamChat`) return newline delimited JSON messages.

Most new endpoints added in this guide (Sharing, Access Policies, Annotations, Forms, Metrics, Chat, Timeline, Identity, Notifications, and more) use this ConnectRPC convention.

---

## Browser and Frontend Considerations

The Factify API servers (`api.factify.com` and `rpc.factify.com`) do **not** return CORS headers. This means **direct calls from browser JavaScript will fail** (for example in React, Next.js client components, Lovable previews) due to the browser's same origin policy.

If you are building a web application:

1. Route all Factify API calls through a backend proxy (serverless function, API route, edge function, etc.).
2. The proxy should accept the user's Factify token from the frontend and forward requests to Factify with `Authorization: Bearer <token>`.
3. Ensure your proxy returns appropriate CORS headers for your frontend origin.

Native or server side applications (Node.js scripts, Python backends, CLI tools) can call the Factify API directly without a proxy.

> **Hackathon tip:** If you are using Lovable, enable Lovable Cloud and add an edge function proxy for Factify API calls. This is usually the fastest way to resolve browser CORS failures.

> **TESTED 2026 02 10: This is confirmed. Direct browser calls to `rpc.factify.com` fail due to CORS. Additionally, all v1beta REST endpoints (`api.factify.com`) are blocked by Cloudflare challenge pages from server side code. You MUST use a backend proxy (Supabase Edge Functions, Next.js API routes, Express server, etc.) AND use ConnectRPC endpoints exclusively. Since all ConnectRPC calls are POST, the effective rate limit is 100 calls per minute per token.**

---

## Documents

Documents are the core resource. Each represents a document that replaces a traditional PDF.

### Create a Document

```
POST /v1beta/documents
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `payload` | file | Yes | PDF file to upload |
| `title` | string | Yes | Title (1 to 255 chars) |
| `description` | string | No | Description (max 2000 chars) |
| `access_level` | string | No | `private` (default), `organization`, or `public` |

**Response:** returns a `document` object.

```json
{
  "document": {
    "id": "doc_01h2xcejqtf2nbrexx3vqjhp41",
    "url": "https://app.factify.com/documents/doc_01h2xcejqtf2nbrexx3vqjhp41",
    "title": "Q1 Financial Report",
    "description": "Quarterly financial summary",
    "access_level": "organization",
    "processing_status": "processing",
    "created_at": "2025-01-15T10:30:00Z",
    "created_by": {
      "id": "user_01h2xcejqtf2nbrexx3vqjhp41",
      "type": "user",
      "name": "Jane Doe"
    },
    "current_version": {
      "id": "ver_01jd4h5mck9gq6zrp8bn2t4w3x",
      "processing_status": "processing"
    }
  }
}
```

**`access_level` values:** `private` (only creator), `organization` (all org members), `public` (anyone with link).

**`processing_status` values:** `processing`, `ready`, `failed`.

### Create a Document (v1alpha, two step upload)

Uses a two step flow: first create the document record and get a presigned upload URL, then upload the file to that URL. This is the approach used by the Factify frontend.

```
POST /api.document.v1alpha.DocumentService/CreateDocument
Content-Type: application/json
```

**Step 1: Create document and get upload URL**

```json
{
  "name": "Q1 Financial Report",
  "description": "Quarterly financial summary",
  "attributes": {
    "accessType": "RESOURCE_ACCESS_TYPE_UNSPECIFIED"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Document title (1 to 256 chars) |
| `description` | string | No | Description (max 512 chars) |
| `attributes` | object | No | Resource attributes (access type, wall config) |
| `document_id` | string (UUID) | No | If set, creates a new version for an existing document |
| `assigned_created_at` | string (ISO 8601) | No | Override creation timestamp |

**Response:**

```json
{
  "documentId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "versionId": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
  "uploadRequestDetails": {
    "url": "https://s3.amazonaws.com/factify-uploads/...",
    "fields": {
      "key": "uploads/019c42ce.../original.pdf",
      "Content-Type": "application/pdf",
      "x-amz-credential": "...",
      "policy": "...",
      "x-amz-signature": "..."
    }
  }
}
```

**Step 2: Upload the file to the presigned URL**

Build a `multipart/form-data` request with all the `fields` from the response, then append the file as the last field:

```bash
curl -X POST "$UPLOAD_URL" \
  -F "key=uploads/019c42ce.../original.pdf" \
  -F "Content-Type=application/pdf" \
  -F "x-amz-credential=..." \
  -F "policy=..." \
  -F "x-amz-signature=..." \
  -F "file=@./contract.pdf"
```

> **Tip:** The `file` field must be the **last** field in the multipart form. The field names and values come directly from the `uploadRequestDetails.fields` map in Step 1.

**`attributes.accessType` values:**
| Value | Description |
|-------|-------------|
| `RESOURCE_ACCESS_TYPE_UNSPECIFIED` | Default (restricted) |
| `RESOURCE_ACCESS_TYPE_RESTRICTED_ACCESS` | Only explicitly shared users |
| `RESOURCE_ACCESS_TYPE_AUTHENTICATED_PUBLIC_ACCESS` | Any authenticated user |
| `RESOURCE_ACCESS_TYPE_UNAUTHENTICATED_PUBLIC_ACCESS` | Anyone with the link |

### Create a Large Document (DAL v1alpha)

Convenience wrapper around the v1alpha `CreateDocument` endpoint. Returns a presigned S3 URL for uploading large files. **This is the endpoint the Factify UI uses for document uploads.**

```
POST /api.dal.v1alpha.DocumentService/CreateLargeDocument
Content-Type: application/json
```

```json
{
  "name": "Q1 Financial Report",
  "description": "Quarterly financial summary",
  "attributes": {
    "accessType": "RESOURCE_ACCESS_TYPE_UNSPECIFIED",
    "wallType": "WALL_TYPE_UNSPECIFIED",
    "wallPage": 0
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Document title (max 256 chars) |
| `description` | string | No | Description (max 512 chars) |
| `assignedCreatedAt` | string (ISO 8601) | No | Override creation timestamp |
| `attributes` | object | No | Resource attributes (see below) |

**Response:** returns `uploadRequestDetails` (presigned URL + form fields) and a `document` object.

```json
{
  "uploadRequestDetails": {
    "url": "https://s3.amazonaws.com/factify-uploads/...",
    "fields": {
      "key": "uploads/019c42ce.../original.pdf",
      "Content-Type": "application/pdf",
      "x-amz-credential": "...",
      "policy": "...",
      "x-amz-signature": "..."
    }
  },
  "document": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "name": "Q1 Financial Report",
    "currentVersionId": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
    "createdById": "039e64e0-b4e9-96cc-af63-e7ccd014c774",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "version": {
      "id": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
      "processingStatus": "processing"
    }
  }
}
```

After receiving the response, upload the file using the same two step process described in the v1alpha `CreateDocument` section above.

> **Note:** This endpoint is technically deprecated (under `api.dal.v1alpha`) but is the primary upload path used by the frontend. The direct `api.document.v1alpha.DocumentService/CreateDocument` endpoint provides equivalent functionality.

### List Documents

```
GET /v1beta/documents
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_size` | integer | No | Items per page (1 to 100, default 50) |
| `page_token` | string | No | Pagination token |
| `created_by_id` | string | No | Filter by creator ID(s), comma separated |
| `access_level` | string | No | Filter: `private`, `organization`, `public`, comma separated |
| `processing_status` | string | No | Filter: `processing`, `ready`, `failed`, comma separated |

**Response:** returns `items` (array of `document` objects) and `pagination`.

> **Warning:** This endpoint may return HTTP 403 `permission_denied` with standard Bearer tokens. If you receive 403, use the ConnectRPC alternative `api.dal.v1alpha.DocumentService/ListDocuments` (documented below in the DAL section) as a fallback.

### Get a Document

```
GET /v1beta/documents/{document_id}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_id` | string | Yes | Document ID |

**Response:** returns a `document` object (same shape as Create).

### Update a Document

```
PATCH /v1beta/documents/{document_id}
Content-Type: application/json
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_id` | string | Yes | Document ID (path) |
| `title` | string | No | New title (1 to 255 chars) |
| `description` | string | No | New description (max 2000 chars) |

**Response:** returns a `document` object (same shape as Create).

### List Documents (DAL v1alpha)

Returns documents with richer filtering than the v1beta endpoint, including permission sets and attached policies.

```
POST /api.dal.v1alpha.DocumentService/ListDocuments
Content-Type: application/json
```

```json
{
  "pagination": {
    "page": 1,
    "pageSize": 20
  },
  "nameContains": "Financial",
  "createdById": ["019c42ce-f2c7-74aa-8f41-c5aabe92a552"],
  "includeAttachedPolicies": true
}
```

> **TESTED 2026 02 10: The pagination format above does NOT work. Use this instead:**
>
> ```json
> {"pagination": {"current_page": 1, "page_size": 20}}
> ```
>
> Also note: this endpoint returns ALL documents in the organization, not just the calling user's documents. Each item includes `createdById` and `userAccount.email` to identify the creator. Filter by `nameContains` or by `createdById` to narrow results.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pagination` | object | No | `{ "current_page": int, "page_size": int }` (see tested correction above) |
| `nameContains` | string | No | Filter by name substring (min 2, max 256 chars) |
| `emailContains` | string | No | Filter by creator email substring |
| `createdById` | string[] | No | Filter by creator UUIDs |
| `dateFilter` | object | No | Filter by date ranges (see below) |
| `policyType` | string | No | Filter by attached policy type |
| `includeAttachedPolicies` | boolean | No | Include policy details in response |
| `filter` | object | No | Structured filter (V1.1 API) |
| `sortBy` | object | No | Structured sort (V1.1 API) |

**`dateFilter` fields:** `updatedAfter`, `updatedBefore`, `createdAfter`, `createdBefore` (ISO 8601 timestamps).

**Response:**

```json
{
  "items": [
    {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "name": "Q1 Financial Report",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-16T08:00:00Z",
      "createdById": "039e64e0-b4e9-96cc-af63-e7ccd014c774",
      "currentVersion": {
        "id": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
        "processingStatus": "ready"
      },
      "permissionSet": {
        "canView": true,
        "canEdit": true,
        "canShare": true
      }
    }
  ],
  "total": 42
}
```

### Get a Document (DAL v1alpha)

Returns full document details including version info, creator account, and supported engines.

```
POST /api.dal.v1alpha.DocumentService/GetDocument
Content-Type: application/json
```

```json
{
  "documentId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentId` | string (UUID) | Yes | Document ID |

**Response:**

```json
{
  "document": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "name": "Q1 Financial Report",
    "currentVersionId": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
    "createdById": "039e64e0-b4e9-96cc-af63-e7ccd014c774",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-16T08:00:00Z",
    "attributes": {},
    "version": {
      "id": "029d53df-a3d8-85bb-9e52-d6bbcf03b663",
      "processingStatus": "ready"
    },
    "shortUrl": "https://ffy.co/d/abc123",
    "supportedEngines": ["APRYSE", "QUARTZ"]
  }
}
```

### Update a Document (DAL v1alpha)

Full replacement update. All fields are overwritten, so you must provide the complete desired state.

```
POST /api.dal.v1alpha.DocumentService/UpdateDocument
Content-Type: application/json
```

```json
{
  "documentId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "name": "Q1 Financial Report (Updated)",
  "attributes": {
    "accessType": "RESOURCE_ACCESS_TYPE_AUTHENTICATED_PUBLIC_ACCESS"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentId` | string (UUID) | Yes | Document ID |
| `name` | string | Yes | Document title (1 to 256 chars) |
| `attributes` | object | Yes | Resource attributes (full replacement) |

> **Warning:** This uses full replacement semantics. Omitted fields are cleared. Use `PatchDocument` for partial updates.

**Response:** returns a `document` object (same shape as `GetDocument`).

### Patch a Document (DAL v1alpha)

Partial update. Only provided fields are changed; omitted fields are left as is.

```
POST /api.dal.v1alpha.DocumentService/PatchDocument
Content-Type: application/json
```

```json
{
  "documentId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "name": "Q1 Financial Report (Revised)"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentId` | string (UUID) | Yes | Document ID |
| `name` | string | No | New title (1 to 256 chars) |
| `description` | string | No | New description (max 512 chars) |
| `attributes` | object | No | Partial resource attributes |

**Response:** returns a `document` object (same shape as `GetDocument`).

### Export a Document (v1alpha)

Downloads a document as a file. Returns a signed URL.

```
POST /api.document.v1alpha.DocumentService/Export
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "version_id": "660e8400-e29b-41d4-a716-446655440001",
  "watermark_config": {
    "position": { "x": 100, "y": 50, "anchor": "tl" },
    "text": { "content": "CONFIDENTIAL", "font_family": "Inter", "font_size": 14, "color": "#FF0000" },
    "background": { "color": "#FFFFFF", "alpha": 0.5, "margin": { "top": 4, "right": 8, "bottom": 4, "left": 8 } }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to export |
| `version_id` | string (UUID) | No | Specific version (defaults to current) |
| `watermark_config` | object | No | Optional watermark overlay |

**Response:**

```json
{
  "url": "https://storage.factify.com/exports/doc_01h2x...?token=abc",
  "expires_at": "2025-02-09T13:00:00Z",
  "headers": {}
}
```

### Get Document Owner (v1alpha)

Returns the organization ID that owns a document.

```
POST /api.document.v1alpha.DocumentService/GetOwner
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |

**Response:**

```json
{
  "organizationId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

> **Known issue:** Requesting a non existent document returns HTTP 500 Internal Error instead of the expected 404. This is a known server side behavior.

### Transfer Document Ownership (v1alpha)

Transfers ownership of a document to another user.

```
POST /api.document.v1alpha.DocumentService/TransferOwnership
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "new_owner_user_account_id": "019346c5-0cf2-7817-d18e-44eda2836070",
  "reason": "Team transition"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to transfer |
| `new_owner_user_account_id` | string (UUID) | Yes | New owner user account ID |
| `reason` | string | No | Reason for transfer (max 512 chars) |

**Response:**

```json
{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "newOwnerUserAccountId": "019346c5-0cf2-7817-d18e-44eda2836070",
  "transferredAt": "2025-02-09T12:00:00Z"
}
```

### Process Document (v1alpha)

Triggers reprocessing of a document version (text extraction, summarization, etc.).

```
POST /api.document.v1alpha.DocumentService/ProcessDocument
Content-Type: application/json
```

```json
{
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001",
  "async": true,
  "work_type": "PROCESS_WORK_TYPE_SEMANTIC_ANALYSIS"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_version_id` | string (UUID) | Yes | Version to process |
| `async` | boolean | No | If true, returns immediately. If false, waits for completion |
| `work_type` | string | No | `PROCESS_WORK_TYPE_SEMANTIC_ANALYSIS` (default) |

**Response:**

```json
{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "versionId": "660e8400-e29b-41d4-a716-446655440001",
  "workflowId": "019c42ce-f2c7-74aa-8f41-c5aabe92a553",
  "status": "started"
}
```

### Trash a Document (v1alpha)

Moves a document to trash and revokes all access except for the owner.

```
POST /api.document.v1alpha.DocumentService/TrashDocument
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to trash |

**Response:** empty object `{}` on success.

> **Permissions:** Requires owner permissions. Standard user tokens receive 403 Forbidden.

### Untrash a Document (v1alpha)

Restores a document from trash. Previous access grants are not restored; you must re-share manually.

```
POST /api.document.v1alpha.DocumentService/UntrashDocument
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to restore |

**Response:** empty object `{}` on success.

### List Duplicate Documents (v1alpha)

Finds documents with matching content based on visual hashing.

```
POST /api.document.v1alpha.DocumentService/ListDuplicateDocuments
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "file_contents_hash": "a1b2c3d4e5f6..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | No | Scope to an organization |
| `file_contents_hash` | string | Yes | SHA256 hash (64 chars) of concatenated page image hashes |

**Response:**

```json
{
  "duplicates": [
    {
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "versionId": "660e8400-e29b-41d4-a716-446655440001",
      "documentName": "Q1 Report",
      "versionName": "Final Draft",
      "lastViewed": "2025-02-08T10:00:00Z"
    }
  ]
}
```

---

## Versions

Each document can have multiple versions. Uploading a new PDF creates a new version.

### Create a Version

```
POST /v1beta/documents/{document_id}/versions
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string | Yes | Document ID (path) |
| `payload` | file | Yes | PDF file for the new version |
| `title` | string | No | Version title (1 to 255 chars) |
| `description` | string | No | Version description (max 2000 chars) |

**Response:** returns a `version` object.

```json
{
  "version": {
    "id": "ver_02abc123def456ghi789jkl012",
    "document_id": "doc_01h2xcejqtf2nbrexx3vqjhp41",
    "url": "https://app.factify.com/versions/ver_02abc123def456ghi789jkl012",
    "title": "Version 2 with amendments",
    "description": "",
    "processing_status": "processing",
    "created_at": "2025-02-01T14:00:00Z",
    "created_by": {
      "id": "user_01h2xcejqtf2nbrexx3vqjhp41",
      "type": "user",
      "name": "Jane Doe"
    }
  }
}
```

### List Versions

```
GET /v1beta/documents/{document_id}/versions
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_id` | string | Yes | Document ID (path) |
| `page_size` | integer | No | Items per page |
| `page_token` | string | No | Pagination token |

**Response:** returns `items` (array of `version` objects) and `pagination`.

### Get a Version

```
GET /v1beta/versions/{version_id}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version_id` | string | Yes | Version ID |

**Response:** returns a `version` object (same shape as Create).

### Update a Version

```
PATCH /v1beta/versions/{version_id}
Content-Type: application/json
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version_id` | string | Yes | Version ID (path) |
| `title` | string | No | New title (1 to 255 chars) |
| `description` | string | No | New description (max 2000 chars) |

**Response:** returns a `version` object (same shape as Create).

---

## Organizations

> **Note:** Organization management uses the v1alpha ConnectRPC Identity endpoints. See the **Identity & User Management** section below for `CreateOrganization`, `GetOrganization`, `ListOrganizations`, and related operations. The `/v1beta/organizations` REST endpoints and all `/v1beta/organizations/{id}/invites` invite endpoints are **not available**.

---

## API Keys

### Create an API Key

```
POST /v1beta/api-keys
Content-Type: application/json
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string | Yes | Organization to create the key for |
| `name` | string | Yes | Human readable name |
| `expires_at` | string | No | ISO 8601 expiration timestamp |

**Response:**

```json
{
  "api_key": {
    "id": "key_01jd4h5mck9gq6zrp8bn2t4w3x",
    "name": "Production",
    "organization_id": "org_01h2xcejqtf2nbrexx3vqjhp41",
    "created_at": "2025-02-09T12:00:00Z",
    "is_active": true,
    "key_prefix": "ffy_prod_abc1"
  },
  "secret": "ffy_prod_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

The `secret` is only returned once at creation time.

### List API Keys

```
GET /v1beta/api-keys?organization_id={org_id}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | string | Yes | Organization to list keys for. Must use `org_` prefixed ID (not UUID). |
| `include_revoked` | boolean | No | Include revoked keys (default false) |
| `page_token` | string | No | Pagination token |
| `page_size` | integer | No | Items per page |

### Revoke an API Key

```
POST /v1beta/api-keys/{api_key_id}/revoke
Content-Type: application/json
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api_key_id` | string | Yes | API key ID to revoke |
| `reason` | string | No | Reason for revocation (max 500 chars) |

---

## Policies

Policies define governance rules that can be attached to documents.

### List Document Policies

```
GET /v1beta/documents/{document_id}/policies
```

Supports `page_token` and `page_size`.

**Response:**

```json
{
  "items": [
    {
      "document_id": "doc_01h2xcejqtf2nbrexx3vqjhp41",
      "attached_at": "2025-01-20T09:00:00Z",
      "attached_by": {
        "id": "user_01h2xcejqtf2nbrexx3vqjhp41",
        "type": "user",
        "name": "Jane Doe"
      },
      "policy": {
        "id": "pol_01h2xcejqtf2nbrexx3vqjhp41",
        "name": "Data Retention Policy",
        "created_at": "2024-12-01T00:00:00Z"
      }
    }
  ],
  "pagination": {
    "next_page_token": null,
    "has_more": false
  }
}
```

### Attach a Policy to a Document

```
POST /v1beta/documents/{document_id}/policies
Content-Type: application/json
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `policy_id` | string | Yes | Policy ID to attach |

### Detach a Policy from a Document

```
DELETE /v1beta/documents/{document_id}/policies/{policy_id}
```

---

## Entry Pages

### Generate Entry Page

Generates a temporary downloadable URL for the document entry page PDF.

```
POST /v1beta/documents/{document_id}/entry_page
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_id` | string | Yes | Document ID |

**Response:**

```json
{
  "download_url": "https://storage.factify.com/entry-pages/doc_01h2xcejqtf2nbrexx3vqjhp41.pdf?token=abc123&expires=1707500000"
}
```

---

## Sharing & Access Control

All endpoints below use the ConnectRPC convention (`POST` with `Content-Type: application/json`).

### Roles Reference

| Role | Enum Value | Description |
|------|-----------|-------------|
| Viewer | `DOCUMENT_ROLE_VIEWER` | Can view the document |
| Commenter | `DOCUMENT_ROLE_COMMENTER` | Can view and add comments |
| Collaborator | `DOCUMENT_ROLE_COLLABORATOR` | Can view, comment, and edit |
| Admin | `DOCUMENT_ROLE_ADMIN` | Full access except ownership transfer |
| Owner | `DOCUMENT_ROLE_OWNER` | Full access including ownership transfer |

### General Access Levels

| Level | Enum Value | Description |
|-------|-----------|-------------|
| Restricted | `DOCUMENT_GENERAL_ACCESS_RESTRICTED` | Only explicitly granted users can access |
| Organization | `DOCUMENT_GENERAL_ACCESS_ORGANIZATION` | All organization members can access |
| Authenticated | `DOCUMENT_GENERAL_ACCESS_AUTHENTICATED` | Any authenticated user can access |
| Public | `DOCUMENT_GENERAL_ACCESS_PUBLIC` | Anyone with the link can access |

### Grant Document Access (v1alpha)

Grants access to one or more recipients (users or emails).

```
POST /api.document.v1alpha.SharingService/GrantDocumentAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipients": [
    {
      "email": "collaborator@example.com",
      "role": "DOCUMENT_ROLE_COLLABORATOR"
    },
    {
      "user_id": "019346c5-0cf2-7817-d18e-44eda2836070",
      "role": "DOCUMENT_ROLE_VIEWER"
    }
  ],
  "suppress_notification": false,
  "message": "Please review the Q1 report"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to share |
| `recipients` | array | Yes | List of recipients |
| `recipients[].email` | string | One of email/user_id | Recipient email |
| `recipients[].user_id` | string (UUID) | One of email/user_id | Recipient user ID |
| `recipients[].role` | string | Yes | Role enum (see Roles Reference) |
| `suppress_notification` | boolean | No | If true, do not send email |
| `message` | string | No | Custom message included in notification |

**Response:** empty object `{}` on success.

> **TESTED 2026 02 10: The response is NOT an empty object. It returns a structured result per recipient:**
>
> ```json
> {
>   "documentId": "019c47ed-0280-71af-ac76-48b4200eecba",
>   "results": [
>     {"recipient": {"email": "vip@example.com", "role": "DOCUMENT_ROLE_VIEWER"}, "success": true}
>   ],
>   "total": 1,
>   "successful": 1
> }
> ```
>
> If a user already has access, the result includes an error per recipient:
> `"error": "user already has access to this document; use UpdateDocumentAccess to change roles"`
>
> Always check `results[].success` and `results[].error` per recipient for proper error handling.

> **Permissions:** These endpoints require elevated permission scope. Standard tokens may receive 403 Forbidden even if they work on other endpoints.

### Revoke Document Access (v1alpha)

Removes a user's access to a document.

```
POST /api.document.v1alpha.SharingService/RevokeDocumentAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipients": [
    { "user_id": "019346c5-0cf2-7817-d18e-44eda2836070" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `recipients` | array | Yes | List of users whose access is revoked (min 1) |
| `recipients[].user_id` | string (UUID) | Yes | User ID to revoke |

**Response:** empty object `{}` on success.

> **Permissions:** These endpoints require elevated permission scope. Standard tokens may receive 403 Forbidden even if they work on other endpoints.

### Update Document Access (v1alpha)

Changes the role of existing document collaborators.

```
POST /api.document.v1alpha.SharingService/UpdateDocumentAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipients": [
    { "user_id": "019346c5-0cf2-7817-d18e-44eda2836070", "role": "DOCUMENT_ROLE_ADMIN" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `recipients` | array | Yes | List of users to update (min 1) |
| `recipients[].user_id` | string (UUID) | Yes | User to update |
| `recipients[].role` | string | Yes | New role enum. Accepted values: `DOCUMENT_ROLE_ADMIN`, `DOCUMENT_ROLE_COLLABORATOR`, `DOCUMENT_ROLE_VIEWER`. The API may reject some role strings with `value must not be in list [0]` |

**Response:** empty object `{}` on success.

> **Permissions:** These endpoints require elevated permission scope. Standard tokens may receive 403 Forbidden even if they work on other endpoints.

### List Document Access (v1alpha)

Returns all users who have access to a document and their roles.

```
POST /api.document.v1alpha.SharingService/ListDocumentAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "recipients": [
    {
      "userId": "019346c5-0cf2-7817-d18e-44eda2836070",
      "email": "owner@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "DOCUMENT_ROLE_OWNER",
      "avatarUrl": "https://..."
    },
    {
      "userId": "019346c5-0cf2-7817-d18e-44eda2836071",
      "email": "viewer@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "DOCUMENT_ROLE_VIEWER",
      "avatarUrl": "https://..."
    }
  ]
}
```

### Set Document General Access (v1alpha)

Sets the general access level for a document (controls who can access without an explicit grant).

```
POST /api.document.v1alpha.SharingService/SetDocumentGeneralAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "general_access": "DOCUMENT_GENERAL_ACCESS_ORGANIZATION",
  "general_access_role": "DOCUMENT_ROLE_VIEWER"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `general_access` | string | Yes | General access level enum |
| `general_access_role` | string | No | Default role for general access users |

**Response:** empty object `{}` on success.

> **Permissions:** These endpoints require elevated permission scope. Standard tokens may receive 403 Forbidden even if they work on other endpoints.

### Get Document General Access (v1alpha)

Returns the current general access setting for a document.

```
POST /api.document.v1alpha.SharingService/GetDocumentGeneralAccess
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "generalAccess": "DOCUMENT_GENERAL_ACCESS_ORGANIZATION",
  "generalAccessRole": "DOCUMENT_ROLE_VIEWER"
}
```

---

## Access Policies & Access Requests

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Policy Types

Currently there is one supported policy type:

| Enum Value | Description |
|------------|-------------|
| `POLICY_TYPE_LEAD_GENERATION_WALL` | Requires viewers to submit a contact form before accessing the document |

### Create Policy (v1alpha)

Creates a reusable access policy that can be attached to documents. You must provide exactly one policy `kind` (currently only `lead_generation_wall` is supported).

**Important:** Before creating a policy, you must first create a Form (see Forms section below) and use the returned `form_id` in the policy request.

```
POST /api.document.v1alpha.DocumentAccessService/CreatePolicy
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Sales Deck Lead Gate",
  "description": "Collect contact info before viewing sales materials",
  "lead_generation_wall": {
    "content_constraint": {
      "page_range": {
        "start_page": 0,
        "end_page": 3
      }
    },
    "form_id": "660e8400-e29b-41d4-a716-446655440001",
    "excluded_emails_domains": ["@partner.com", "vip@client.com"],
    "blocked_emails_domains": ["@competitor.com"]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Owning organization |
| `name` | string | Yes | Policy name (max 255 chars) |
| `description` | string | No | Policy description (max 255 chars) |
| `lead_generation_wall` | object | Yes (one `kind` required) | Lead gen wall configuration |
| `lead_generation_wall.content_constraint` | object | Yes | Defines which pages are locked |
| `lead_generation_wall.content_constraint.page_range` | object | Yes | Page range that is **unlocked** (visible without form). Use `0, 0` to lock the entire document |
| `lead_generation_wall.content_constraint.page_range.start_page` | integer | Yes | Start page (0 based). `0` = first page |
| `lead_generation_wall.content_constraint.page_range.end_page` | integer | Yes | End page (0 based, inclusive). Must be >= start_page |
| `lead_generation_wall.form_id` | string (UUID) | Yes | ID of the form viewers must submit (create it first via FormService) |
| `lead_generation_wall.excluded_emails_domains` | array of strings | No | Whitelist: emails or domain patterns (e.g. `"@partner.com"`) that skip the wall |
| `lead_generation_wall.blocked_emails_domains` | array of strings | No | Blocklist: emails or domain patterns that are blocked from accessing the document entirely |

**Pattern format for email/domain lists:** exact email (`"user@example.com"`) or domain wildcard (`"@partner.com"`, matches exact domain only, not subdomains).

**Response:**

```json
{
  "policy": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Sales Deck Lead Gate",
    "description": "Collect contact info before viewing sales materials",
    "leadGenerationWall": {
      "contentConstraint": {
        "pageRange": { "startPage": 0, "endPage": 3 }
      },
      "form": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "organizationId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Contact Form",
        "payloadType": "PAYLOAD_TYPE_CONTACT_FORM",
        "requiresEmailOtp": false
      },
      "excludedEmailsDomains": ["@partner.com", "vip@client.com"],
      "blockedEmailsDomains": ["@competitor.com"]
    },
    "createdAt": "2025-02-09T12:00:00Z",
    "updatedAt": "2025-02-09T12:00:00Z"
  }
}
```

**Note:** In the response, the `leadGenerationWall` contains the full `form` object (not just `form_id`). In the request, you only send `form_id`.

### Get Policy (v1alpha)

```
POST /api.document.v1alpha.DocumentAccessService/GetPolicy
Content-Type: application/json
```

```json
{
  "policy_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

**Response:** returns a `policy` object (same shape as Create Policy response).

### Update Policy (v1alpha)

Updates an existing policy. You must provide the `policy_id` and exactly one policy `kind`.

> **Important:** Updates use **full replacement semantics**, not partial/merge. If you omit a field (like `description`), it gets cleared. Always send the complete policy object.

```
POST /api.document.v1alpha.DocumentAccessService/UpdatePolicy
Content-Type: application/json
```

```json
{
  "policy_id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Updated Sales Lead Gate",
  "description": "Updated description for the sales lead gate",
  "lead_generation_wall": {
    "content_constraint": {
      "page_range": {
        "start_page": 0,
        "end_page": 5
      }
    },
    "form_id": "660e8400-e29b-41d4-a716-446655440001",
    "excluded_emails_domains": ["@partner.com", "@vip.com"],
    "blocked_emails_domains": ["@competitor.com"]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `policy_id` | string (UUID) | Yes | ID of the policy to update |
| `name` | string | No | New policy name (max 255 chars) |
| `description` | string | No | New policy description (max 255 chars) |
| `lead_generation_wall` | object | Yes (one `kind` required) | Same structure as CreatePolicy |

**Response:** returns an updated `policy` object (same shape as CreatePolicy response).

### List Policies (v1alpha)

Lists all access policies for an organization.

```
POST /api.document.v1alpha.DocumentAccessService/ListPolicies
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "page_size": 20,
  "cursor": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Organization to list policies for |
| `page_size` | integer | No | Items per page (default 20) |
| `cursor` | string | No | Pagination cursor from previous response |

**Response:**

```json
{
  "policies": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "organizationId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Sales Deck Lead Gate",
      "leadGenerationWall": { "..." : "..." }
    }
  ],
  "nextCursor": "eyJ..."
}
```

### Attach Access Policy (v1alpha)

Attaches an access policy to a document. Users accessing the document must satisfy the policy requirements before they can view the document content.

```
POST /api.document.v1alpha.DocumentAccessService/AttachAccessPolicy
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "policy_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Organization that owns the policy |
| `document_id` | string (UUID) | Yes | Document to attach the policy to |
| `policy_id` | string (UUID) | Yes | Policy to attach |

**Response:** empty object `{}` on success.

### Detach Access Policy (v1alpha)

Removes an access policy from a document, restoring unrestricted access for users with appropriate roles.

```
POST /api.document.v1alpha.DocumentAccessService/DetachAccessPolicy
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "policy_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Organization that owns the policy |
| `document_id` | string (UUID) | Yes | Document to detach the policy from |
| `policy_id` | string (UUID) | Yes | Policy to detach |

**Response:** empty object `{}` on success.

### Inspect Access (v1alpha)

Returns the effective permissions for the calling user on a document, resolving all policies, roles, and general access settings into a single permission set.

```
POST /api.document.v1alpha.DocumentAccessService/InspectAccess
Content-Type: application/json
```

```json
{
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e"
}
```

**Response:**

```json
{
  "documentId": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "permissionSet": {
    "view": true,
    "manageAccess": false,
    "grantAccess": false,
    "commentPrivate": true,
    "commentPublic": false,
    "createVersion": false,
    "listVersions": false,
    "copyContent": false,
    "screenshot": false,
    "viewAnalytics": false,
    "viewTimeline": false,
    "export": false,
    "open": true,
    "trash": false,
    "viewLeads": false,
    "attachPolicy": false
  },
  "accessPolicies": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "organizationId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Sales Deck Lead Gate",
      "leadGenerationWall": { "..." : "..." }
    }
  ]
}
```

**`permissionSet` fields (all boolean):**

| Permission | Description | Minimum Role |
|------------|-------------|--------------|
| `view` | Can view the document content | Viewer |
| `manage_access` | Full access management (grant/revoke/modify any role) | Admin |
| `grant_access` | Can grant new access only (cannot revoke or modify) | Collaborator |
| `comment_private` | Can create private annotations | Viewer |
| `comment_public` | Can create public comments/annotations | Commenter |
| `create_version` | Can upload new versions | Collaborator |
| `list_versions` | Can view version history | Collaborator |
| `copy_content` | Can copy document content to clipboard | Collaborator |
| `screenshot` | Can take screenshots of the document | Collaborator |
| `view_analytics` | Can view document metrics and analytics | Collaborator |
| `view_timeline` | Can view the audit timeline | Admin |
| `export` | Can export the original document file | Admin |
| `open` | Can access the document interface (shows lead gen wall if no `view`) | Anyone with link or Viewer+ |
| `trash` | Can trash/untrash the document | Owner only |
| `view_leads` | Can view lead generation form submissions | Collaborator |
| `attach_policy` | Can attach/detach access policies | Admin |

**Lead generation wall state:** When `open` is `true` but `view` is `false`, the user sees the lead generation wall. After submitting the form, `view` becomes `true`.

### Create Access Request (v1alpha)

Submits a request for access to a document (used when a user hits a lead gen wall or restricted document).

```
POST /api.document.v1alpha.DocumentAccessService/CreateAccessRequest
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "permission": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document being requested |
| `permission` | integer | Yes | Permission level requested as a numeric value (e.g. `1` for view). String enums like `"PERMISSION_VIEW"` are not accepted. |

**Response:**

```json
{
  "accessRequest": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "permission": "DOCUMENT_PERMISSION_VIEW",
    "status": "ACCESS_REQUEST_STATUS_PENDING"
  }
}
```

If `otp_required` is `true`, the client must prompt the user for an OTP sent to their email, then resubmit.

### List Access Requests (v1alpha)

Lists access requests for a document.

```
POST /api.document.v1alpha.DocumentAccessService/ListAccessRequests
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "page_size": 20,
  "cursor": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document to list requests for |
| `page_size` | integer | Yes | Items per page. Omitting this returns HTTP 400. |
| `cursor` | string | No | Pagination cursor from previous response |

**Response:**

```json
{
  "accessRequests": [
    {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "email": "requester@example.com",
      "firstName": "Alice",
      "lastName": "Jones",
      "company": "Acme Inc.",
      "status": "ACCESS_REQUEST_STATUS_PENDING",
      "createdAt": "2025-02-09T12:00:00Z"
    }
  ],
  "nextCursor": ""
}
```

### Approve Access Request (v1alpha)

Approves a pending access request, granting the requester access.

```
POST /api.document.v1alpha.DocumentAccessService/ApproveAccessRequest
Content-Type: application/json
```

```json
{
  "request_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

**Response:** empty object `{}` on success.

### Deny Access Request (v1alpha)

Denies a pending access request.

```
POST /api.document.v1alpha.DocumentAccessService/DenyAccessRequest
Content-Type: application/json
```

```json
{
  "request_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

**Response:** empty object `{}` on success.

### Check Access Request Status (v1alpha)

Checks the status of a previously submitted access request.

```
POST /api.document.v1alpha.DocumentAccessService/CheckAccessRequestStatus
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "requester@example.com"
}
```

**Response:**

```json
{
  "status": "ACCESS_REQUEST_STATUS_APPROVED"
}
```

Status values: `ACCESS_REQUEST_STATUS_UNSPECIFIED`, `ACCESS_REQUEST_STATUS_PENDING`, `ACCESS_REQUEST_STATUS_APPROVED`, `ACCESS_REQUEST_STATUS_DENIED`.

---

## Annotations

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Create Annotation (v1alpha)

Creates a positional annotation on a document page.

```
POST /api.document.v1alpha.AnnotationService/CreateAnnotation
Content-Type: application/json
```

```json
{
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001",
  "data": "<binary annotation data>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_version_id` | string (UUID) | Yes | The combined document version identifier |
| `data` | bytes | Yes | Protobuf encoded blob containing the annotation content, position, type, and formatting |

> **Note:** The `data` field is a protobuf encoded binary payload. It encodes the annotation's page number, coordinates, content text, privacy setting, annotation type, and format. Refer to the protobuf schema for the exact encoding.

> **TESTED 2026 02 10: The `data` field is NOT protobuf. For general (non positional) comments, it is simply base64 encoded text. The actual working request format (discovered from the Factify frontend) is:**
>
> ```json
> {
>   "id": "<client-generated-uuid>",
>   "documentVersionId": "019c47ed-027f-74b7-8999-321c7a5e2c67",
>   "data": "VGhpcyBpcyBteSBjb21tZW50",
>   "format": "ANNOTATION_FORMAT_XFDF",
>   "privacy": "ANNOTATION_PRIVACY_PUBLIC",
>   "commentText": "This is my comment"
> }
> ```
>
> **Key differences from the documented format:**
> - `id` (client generated UUID) is required
> - Field name is `documentVersionId` (camelCase), not `document_version_id`
> - `data` is base64 of the comment text: `btoa("This is my comment")`
> - `format` must be `ANNOTATION_FORMAT_XFDF`
> - `privacy` controls visibility: `ANNOTATION_PRIVACY_PUBLIC` or `ANNOTATION_PRIVACY_PRIVATE`
> - `commentText` contains the plain text comment
> - **Requires additional header: `connect-protocol-version: 1`**
>
> Response on success: `{"id": "<the-uuid-you-sent>"}`

**Response:**

```json
{
  "annotation": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "pageNumber": 3,
    "coordinates": { "x": 120.5, "y": 340.2, "width": 200.0, "height": 50.0 },
    "content": "This paragraph needs revision.",
    "privacy": "ANNOTATION_PRIVACY_SHARED",
    "annotationType": "ANNOTATION_TYPE_COMMENT",
    "format": "ANNOTATION_FORMAT_PLAIN_TEXT",
    "createdBy": "019346c5-0cf2-7817-d18e-44eda2836070",
    "createdAt": "2025-02-09T12:00:00Z",
    "updatedAt": "2025-02-09T12:00:00Z"
  }
}
```

### Get Annotation (v1alpha)

```
POST /api.document.v1alpha.AnnotationService/GetAnnotation
Content-Type: application/json
```

```json
{
  "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a560"
}
```

**Response:** returns an `annotation` object (same shape as Create response).

### Update Annotation (v1alpha)

```
POST /api.document.v1alpha.AnnotationService/UpdateAnnotation
Content-Type: application/json
```

```json
{
  "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a560",
  "content": "Updated annotation text.",
  "coordinates": { "x": 120.5, "y": 340.2, "width": 210.0, "height": 55.0 },
  "resolved": true
}
```

**Response:** returns the updated `annotation` object.

### Delete Annotation (v1alpha)

```
POST /api.document.v1alpha.AnnotationService/DeleteAnnotation
Content-Type: application/json
```

```json
{
  "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a560"
}
```

**Response:** empty object `{}` on success.

### List Annotations (v1alpha)

Lists all annotations for a document, optionally filtered by page.

```
POST /api.document.v1alpha.AnnotationService/ListAnnotations
Content-Type: application/json
```

```json
{
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001",
  "page_number": 3
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_version_id` | string (UUID) | Yes | The combined document version identifier |
| `page_number` | integer | No | Filter to a specific page |

**Response:**

```json
{
  "annotations": [
    { "id": "...", "pageNumber": 3, "content": "...", "..." : "..." }
  ]
}
```

---

## Comments

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Create Comment (v1alpha)

```
POST /api.document.v1alpha.CommentService/CreateComment
Content-Type: application/json
```

```json
{
  "annotation_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a560",
  "content": "I agree, this needs to be reworded.",
  "parent_comment_id": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `annotation_id` | string (UUID) | Yes | Annotation this comment belongs to |
| `content` | string | Yes | Comment body |
| `parent_comment_id` | string (UUID) | No | For threaded replies |

**Response:**

```json
{
  "comment": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a554",
    "annotationId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "content": "I agree, this needs to be reworded.",
    "createdBy": "019346c5-0cf2-7817-d18e-44eda2836070",
    "createdAt": "2025-02-09T12:00:00Z"
  }
}
```

### Update Comment (v1alpha)

```
POST /api.document.v1alpha.CommentService/UpdateComment
Content-Type: application/json
```

```json
{
  "comment_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a561",
  "content": "Updated comment text."
}
```

**Response:** returns the updated `comment` object.

### Delete Comment (v1alpha)

```
POST /api.document.v1alpha.CommentService/DeleteComment
Content-Type: application/json
```

```json
{
  "comment_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a561"
}
```

**Response:** empty object `{}` on success.

> **Note:** There are no `ListComments` or `GetComment` endpoints available in the `CommentService`. Comments can only be created, updated, and deleted. To display existing comments, use the `ListAnnotations` endpoint, which returns annotations along with their associated comments.

---

## Forms

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

Forms are organization level resources. You create a form under an organization, then reference it by `form_id` when creating a policy. The form defines what data viewers must submit (currently only Contact Form is supported).

### Payload Types

| Enum Value | Description |
|------------|-------------|
| `PAYLOAD_TYPE_CONTACT_FORM` | A contact information form with name, email, phone, company, and role fields |

### Contact Form Payload Schema

When submitting a form of type `PAYLOAD_TYPE_CONTACT_FORM`, the payload must contain a `contact_form` object:

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `contact_form.full_name` | string | Yes | 255 | Full name of the person submitting |
| `contact_form.email_address` | string (email) | Yes | N/A | Valid email address |
| `contact_form.phone_number` | string | No | 64 | Phone number (e.g. `"+1 234 567 890"`) |
| `contact_form.company_name` | string | No | 255 | Company name |
| `contact_form.company_role` | string | No | 255 | Role at the company (e.g. `"CEO"`) |

### Create Form (v1alpha)

Creates a reusable form under an organization. Use the returned `form.id` when creating a lead generation policy.

```
POST /api.document.v1alpha.FormService/CreateForm
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Sales Lead Contact Form",
  "description": "Collect visitor details before granting document access",
  "payload_type": "PAYLOAD_TYPE_CONTACT_FORM",
  "requires_email_otp": false,
  "requires_per_document_submission": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Owning organization |
| `title` | string | Yes | Form title (max 255 chars) |
| `description` | string | No | Form description (max 1000 chars) |
| `payload_type` | string (enum) | Yes | Must be `PAYLOAD_TYPE_CONTACT_FORM` |
| `requires_email_otp` | boolean | No | If `true`, viewers must verify their email with a one time code before submission |
| `requires_per_document_submission` | boolean | No | If `true`, viewers must submit the form for each document separately (even if they already submitted for another document using the same form) |

**Response:**

```json
{
  "form": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Sales Lead Contact Form",
    "description": "Collect visitor details before granting document access",
    "payloadType": "PAYLOAD_TYPE_CONTACT_FORM",
    "requiresEmailOtp": false,
    "requiresPerDocumentSubmission": false,
    "createdAt": "2025-02-09T12:00:00Z",
    "updatedAt": "2025-02-09T12:00:00Z"
  }
}
```

### Get Form (v1alpha)

Retrieves a single form by its ID.

```
POST /api.document.v1alpha.FormService/GetForm
Content-Type: application/json
```

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:** returns a `form` object (same shape as CreateForm response).

### Update Form (v1alpha)

Updates an existing form. Only the provided fields are changed.

```
POST /api.document.v1alpha.FormService/UpdateForm
Content-Type: application/json
```

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Updated Contact Form",
  "description": "Updated description",
  "requires_email_otp": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `form_id` | string (UUID) | Yes | ID of the form to update |
| `title` | string | No | New title (max 255 chars) |
| `description` | string | No | New description (max 1000 chars) |
| `requires_email_otp` | boolean | No | Update OTP requirement |
| `requires_per_document_submission` | boolean | No | Update per document submission requirement |

**Note:** `payload_type` cannot be changed after creation.

**Response:** returns the updated `form` object.

### List Forms (v1alpha)

Lists all forms for an organization.

```
POST /api.document.v1alpha.FormService/ListForms
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Organization to list forms for |

**Response:**

```json
{
  "forms": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "organizationId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Sales Lead Contact Form",
      "payloadType": "PAYLOAD_TYPE_CONTACT_FORM",
      "requiresEmailOtp": false,
      "requiresPerDocumentSubmission": false,
      "createdAt": "2025-02-09T12:00:00Z",
      "updatedAt": "2025-02-09T12:00:00Z"
    }
  ]
}
```

### Submit Form (v1alpha)

Submits a completed form. This is what a viewer calls after filling out the lead generation form.

The response is a **oneof**: you either get a `submission` (success) or an `otp_required` message (you must re submit with a valid OTP code).

```
POST /api.document.v1alpha.FormService/SubmitForm
Content-Type: application/json
```

**Example (Contact Form submission):**

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "share_link_id": "880e8400-e29b-41d4-a716-446655440003",
  "payload": {
    "contact_form": {
      "full_name": "Bob Vance",
      "email_address": "bob@vancerefrigeration.com",
      "phone_number": "+1 234 567 890",
      "company_name": "Vance Refrigeration Inc.",
      "company_role": "CEO"
    }
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `form_id` | string (UUID) | Yes | Form to submit |
| `document_id` | string (UUID) | Yes | Document this submission grants access to |
| `share_link_id` | string (UUID) | No | Share link used to reach this form |
| `payload` | object | Yes | Must contain one payload type (see below) |
| `payload.contact_form` | object | Yes (for CONTACT_FORM) | Contact form fields (see Contact Form Payload Schema above) |
| `otp` | string | No | 6 to 8 digit numeric code for email verification (required if form has `requires_email_otp: true`) |

**Success response:**

```json
{
  "submission": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "formId": "660e8400-e29b-41d4-a716-446655440001",
    "documentId": "01984b45-a787-702e-bd88-e9c91e14b04e",
    "shareLinkId": "880e8400-e29b-41d4-a716-446655440003",
    "payload": {
      "contactForm": {
        "fullName": "Bob Vance",
        "emailAddress": "bob@vancerefrigeration.com",
        "phoneNumber": "+1 234 567 890",
        "companyName": "Vance Refrigeration Inc.",
        "companyRole": "CEO"
      }
    },
    "createdAt": "2025-02-09T12:00:00Z"
  }
}
```

**OTP required response (if `requires_email_otp` is true and no OTP was provided):**

```json
{
  "otpRequired": {
    "message": "Please verify your email address",
    "expiresAt": "2025-02-09T12:10:00Z"
  }
}
```

When you receive `otp_required`, re submit the same request with the `otp` field included.

### Get Form Submissions (v1alpha)

Retrieves all submissions for a form, optionally filtered to a specific document.

```
POST /api.document.v1alpha.FormService/GetFormSubmissions
Content-Type: application/json
```

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "filters": {
    "page_size": 50,
    "cursor": ""
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `form_id` | string (UUID) | Yes | Form to get submissions for |
| `document_id` | string (UUID) | No | Filter to submissions for a specific document |
| `filters` | object | No | Pagination filters |
| `filters.page_size` | integer | No | Items per page |
| `filters.cursor` | string | No | Pagination cursor from previous response |

**Response:**

```json
{
  "submissions": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "formId": "660e8400-e29b-41d4-a716-446655440001",
      "documentId": "01984b45-a787-702e-bd88-e9c91e14b04e",
      "shareLinkId": "880e8400-e29b-41d4-a716-446655440003",
      "payload": {
        "contactForm": {
          "fullName": "Bob Vance",
          "emailAddress": "bob@vancerefrigeration.com",
          "companyName": "Vance Refrigeration Inc.",
          "companyRole": "CEO"
        }
      },
      "createdAt": "2025-02-09T12:00:00Z"
    }
  ]
}
```

---

## Share Links

### Create Share Link (v1alpha)

Creates a shareable link for a document with optional settings.

```
POST /api.document.v1alpha.ShareLinkService/CreateShareLink
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "version_id": "660e8400-e29b-41d4-a716-446655440001",
  "include_utm": true,
  "custom_slug": "q1-report"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `version_id` | string (UUID) | No | Pin to specific version |
| `include_utm` | boolean | No | Append UTM tracking parameters |
| `custom_slug` | string | No | Custom URL slug |

**Response:**

```json
{
  "shareLink": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2025-02-09T12:00:00Z",
    "creatorId": "019346c5-0cf2-7817-d18e-44eda2836070"
  },
  "shortUrl": "https://ffy.co/d/q1-report"
}
```

> **Note:** There are no `ListShareLinks` or `GetShareLink` endpoints available in the `ShareLinkService`. Once a share link is created, the returned `shortUrl` should be stored client side as there is no way to retrieve it again through this service.

---

## Document Metrics & Analytics

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Capture Client Events (v1alpha)

Sends a batch of client side analytics events (page views, scroll depth, time on page, etc.).

```
POST /api.document.v1alpha.DocumentMetricsService/CaptureClientEvents
Content-Type: application/json
```

```json
{
  "events": [
    {
      "client_session_id": "sess_abc123",
      "captured_at": "2025-02-09T12:00:00Z",
      "document_context": {
        "document_id": "550e8400-e29b-41d4-a716-446655440000"
      }
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `events` | array | Yes | List of client events |
| `events[].client_session_id` | string | Yes | Client session identifier |
| `events[].captured_at` | string (ISO 8601) | Yes | When the event was captured |
| `events[].document_context` | object | Yes | Document context for the event |
| `events[].document_context.document_id` | string (UUID) | Yes | Associated document |

**Response:** empty object `{}` on success.

### Get Document Metrics (v1alpha)

Returns aggregate metrics for a document (total views, unique viewers, avg time, etc.).

```
POST /api.document.v1alpha.DocumentMetricsService/GetDocumentMetrics
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "version_id": "660e8400-e29b-41d4-a716-446655440001",
  "date_from": "2025-01-01T00:00:00Z",
  "date_to": "2025-02-09T23:59:59Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `version_id` | string (UUID) | No | Filter by version |
| `date_from` | string (ISO 8601) | No | Start of date range |
| `date_to` | string (ISO 8601) | No | End of date range |

**Response:**

```json
{
  "totalViews": 342,
  "uniqueViewers": 87,
  "averageTimeSeconds": 145,
  "averageCompletionRate": 0.68,
  "pageMetrics": [
    { "pageNumber": 1, "views": 342, "avgTimeSeconds": 35 },
    { "pageNumber": 2, "views": 298, "avgTimeSeconds": 42 }
  ]
}
```

> **TESTED 2026 02 10: For documents with zero views, the response is `{"summaryStatistics": {}}` (not the full structure above). Metrics only populate after a real user views the document through the Factify viewer at `d.factify.com`. Also, you get `permission_denied` when querying metrics on documents you don't own or have admin access to. Only document owners/admins can view their document's metrics.**

### List Session Metrics (v1alpha)

Returns per session viewer analytics.

```
POST /api.document.v1alpha.DocumentMetricsService/ListSessionMetrics
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "page_size": 50,
  "cursor": ""
}
```

**Response:**

```json
{
  "sessions": [
    {
      "sessionId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "viewerEmail": "viewer@example.com",
      "startedAt": "2025-02-09T10:00:00Z",
      "durationSeconds": 180,
      "pagesViewed": 5,
      "completionRate": 0.83,
      "device": "desktop",
      "referrer": "https://google.com"
    }
  ],
  "nextCursor": ""
}
```

### Get AI Messages Metrics (v1alpha)

Returns metrics on AI chat usage within a document.

```
POST /api.document.v1alpha.DocumentMetricsService/GetAIMessagesMetrics
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "sort_by": "AI_METRICS_SORT_BY_CREATED_AT",
  "page_size": 20,
  "cursor": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `sort_by` | string | No | `AI_METRICS_SORT_BY_CREATED_AT` or `AI_METRICS_SORT_BY_FEEDBACK` |
| `page_size` | integer | No | Items per page |
| `cursor` | string | No | Pagination cursor |

**Response:**

```json
{
  "messages": [
    {
      "messageId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "question": "What are the key findings?",
      "answer": "The key findings include...",
      "feedback": "FEEDBACK_VALUE_POSITIVE",
      "createdAt": "2025-02-09T12:00:00Z"
    }
  ],
  "nextCursor": ""
}
```

### List Document Viewers by Referrals (v1alpha)

Returns viewer data grouped by referral source.

```
POST /api.document.v1alpha.DocumentMetricsService/ListDocumentViewersByReferrals
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "page_size": 20,
  "cursor": ""
}
```

**Response:**

```json
{
  "referrals": [
    {
      "referrer": "https://google.com",
      "viewerCount": 42,
      "totalViews": 67
    },
    {
      "referrer": "direct",
      "viewerCount": 30,
      "totalViews": 45
    }
  ],
  "nextCursor": ""
}
```

### Get Viewer Referrals (v1alpha)

Returns detailed referral information for a specific viewer.

```
POST /api.document.v1alpha.DocumentMetricsService/GetViewerReferrals
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "viewer_id": "019346c5-0cf2-7817-d18e-44eda2836070"
}
```

**Response:**

```json
{
  "referralChain": [
    {
      "referrerEmail": "sender@example.com",
      "referredEmail": "viewer@example.com",
      "referralType": "email_share",
      "createdAt": "2025-02-09T10:00:00Z"
    }
  ]
}
```

---

## In Document Chat (AI)

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Get Welcome (v1alpha)

Returns the welcome message and suggested questions for the AI chat on a document.

```
POST /api.chat.v1alpha.InDocChatService/GetWelcome
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**

```json
{
  "conversationId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "welcome": {}
}
```

> **Note:** The `welcome` object may be empty. There is no guaranteed `message` or `suggestedQuestions` field. The `conversationId` is always present at the root.

### Get History (v1alpha)

Returns the chat history for the current user on a document.

```
POST /api.chat.v1alpha.InDocChatService/GetHistory
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "messages": [
    {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "role": "MESSAGE_ROLE_USER",
      "content": "What are the key findings?",
      "createdAt": "2025-02-09T12:00:00Z"
    },
    {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a553",
      "role": "MESSAGE_ROLE_ASSISTANT",
      "content": "The key findings include...",
      "createdAt": "2025-02-09T12:00:01Z"
    }
  ]
}
```

Message roles: `MESSAGE_ROLE_USER`, `MESSAGE_ROLE_ASSISTANT`, `MESSAGE_ROLE_SYSTEM`.

### Clear History (v1alpha)

Clears all chat history for the current user on a document.

```
POST /api.chat.v1alpha.InDocChatService/ClearHistory
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001",
  "conversation_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a554"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `document_version_id` | string (UUID) | No | Specific version to clear history for |
| `conversation_id` | string (UUID) | No | Specific conversation to clear |

**Response:** `{"success": true}` on success.

### Submit Feedback (v1alpha)

Submits feedback (thumbs up/down) on an AI response.

```
POST /api.chat.v1alpha.InDocChatService/SubmitFeedback
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "conversation_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a554",
  "message_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a553",
  "value": "FEEDBACK_VALUE_POSITIVE"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `conversation_id` | string (UUID) | Yes | Conversation ID |
| `message_id` | string (UUID) | Yes | AI message ID (must be a valid UUID) |
| `value` | string | Yes | `FEEDBACK_VALUE_POSITIVE` or `FEEDBACK_VALUE_NEGATIVE` |

**Response:** empty object `{}` on success.

### Stream Chat (v1alpha) (Server Streaming)

Sends a question and receives a streaming AI response. This is a **server streaming RPC**: the response is newline delimited JSON, with each line being a `StreamChatResponse` object. Note that this endpoint requires `Content-Type: application/connect+json` (not `application/json`).

```
POST /api.chat.v1alpha.InDocChatService/StreamChat
Content-Type: application/connect+json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "question": "What are the key findings in section 3?",
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `question` | string | Yes | User question |
| `document_version_id` | string (UUID) | No | Target a specific version |

**Response** (newline delimited JSON stream):

```json
{"eventType":"STREAM_CHAT_EVENT_TYPE_STARTED","messageId":"019c42ce-f2c7-74aa-8f41-c5aabe92a554"}
{"eventType":"STREAM_CHAT_EVENT_TYPE_DELTA","delta":"The key findings "}
{"eventType":"STREAM_CHAT_EVENT_TYPE_DELTA","delta":"in section 3 include..."}
{"eventType":"STREAM_CHAT_EVENT_TYPE_DONE","fullResponse":"The key findings in section 3 include...","references":[{"page":3,"snippet":"..."}]}
```

Event types: `STREAM_CHAT_EVENT_TYPE_STARTED`, `STREAM_CHAT_EVENT_TYPE_DELTA`, `STREAM_CHAT_EVENT_TYPE_DONE`, `STREAM_CHAT_EVENT_TYPE_ERROR`.

> **Known issue:** This endpoint returns `unauthenticated` even with a valid Bearer token when using `Content-Type: application/connect+json`. Other InDocChatService endpoints work fine with the same token. This may require special authentication handling for streaming requests.

> **Note:** The request field for the user's question is `question`, not `message`.

### Get Raw Text (v1alpha)

Returns the extracted raw text of a document, useful for AI context.

```
POST /api.chat.v1alpha.InDocChatService/GetRawText
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**

```json
{
  "pages": [
    { "pageNumber": 1, "text": "Introduction\nThis document covers..." },
    { "pageNumber": 2, "text": "Section 1: Overview\n..." }
  ]
}
```

> **Note:** This endpoint may return an empty `{}` for documents that have not been fully processed. The `pages` array is only present once processing is complete.

> **TESTED 2026 02 10: Text extraction runs as a SEPARATE async process from document processing. A document can show `PAYLOAD_STATUS_COMPLETED` but still return `{}` from GetRawText. In testing, upload + processing took ~5 seconds, but text extraction took 30+ seconds more. Implement polling with exponential backoff (e.g., check every 5s, then 7.5s, then 11s, up to 30s intervals, for up to 2 minutes). Once text is available, cache it to avoid repeated calls.**
>
> ```javascript
> async function waitForRawText(docId, versionId, token, maxAttempts = 12) {
>   for (let i = 0; i < maxAttempts; i++) {
>     const result = await getRawText(docId, versionId, token);
>     if (result.pages && result.pages.length > 0) return result;
>     await sleep(Math.min(5000 * Math.pow(1.5, i), 30000));
>   }
>   return null;
> }
> ```

---

## Timeline

### Get Timeline (v1alpha)

Returns the activity timeline for a document, including views, shares, edits, and other events.

```
POST /api.document.v1alpha.TimelineService/GetTimeline
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "page_size": 50,
  "cursor": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `page_size` | integer | No | Items per page |
| `cursor` | string | No | Pagination cursor |

**Response:**

```json
{
  "events": [
    {
      "eventId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "eventType": "TIMELINE_EVENT_TYPE_DOCUMENT_VIEWED",
      "occurredAt": "2025-02-09T12:00:00Z",
      "payload": "{\"actor\":{\"email\":\"viewer@example.com\"},\"action\":\"viewed\"}"
    },
    {
      "eventId": "019c42ce-f2c7-74aa-8f41-c5aabe92a553",
      "eventType": "TIMELINE_EVENT_TYPE_ACCESS_GRANTED",
      "occurredAt": "2025-02-09T11:00:00Z",
      "payload": "{\"actor\":{\"email\":\"owner@example.com\"},\"action\":\"granted_access\",\"recipient\":\"viewer@example.com\",\"role\":\"DOCUMENT_ROLE_VIEWER\"}"
    }
  ],
  "nextCursor": "",
  "hasMore": false
}
```

> **Note:** The response structure uses `eventId` (UUID, not prefixed), `eventType`, `occurredAt`, and a `payload` JSON string (not separate actor/metadata fields). The `hasMore` boolean indicates whether more pages are available.

> **TESTED 2026 02 10: The `payload` field is a JSON STRING, not a JSON object. You must parse it separately:**
>
> ```javascript
> const event = response.events[0];
> const payloadData = JSON.parse(event.payload);
> // payloadData contains: action_id, action_name, document_id, user_email, user_id, user_name
> ```
>
> Observed event types: `TIMELINE_EVENT_TYPE_DOCUMENT_CREATED`. The payload for a creation event includes `action_name: "document.created"`, `user_email`, and `user_id`.

Event types include: `TIMELINE_EVENT_TYPE_DOCUMENT_VIEWED`, `TIMELINE_EVENT_TYPE_DOCUMENT_CREATED`, `TIMELINE_EVENT_TYPE_VERSION_UPLOADED`, `TIMELINE_EVENT_TYPE_ACCESS_GRANTED`, `TIMELINE_EVENT_TYPE_ACCESS_REVOKED`, `TIMELINE_EVENT_TYPE_GENERAL_ACCESS_CHANGED`, `TIMELINE_EVENT_TYPE_COMMENT_ADDED`, `TIMELINE_EVENT_TYPE_ANNOTATION_ADDED`, `TIMELINE_EVENT_TYPE_FORM_SUBMITTED`, `TIMELINE_EVENT_TYPE_DOCUMENT_EXPORTED`, `TIMELINE_EVENT_TYPE_OWNERSHIP_TRANSFERRED`.

---

## Content Rendering

> **Service name:** `ContentService` (path: `api.document.v1alpha.ContentService`). Not `ContentRenderingService`.

### Get Quartz Bundle (v1alpha)

Retrieves the rendered document content bundle (HTML/JSON representation used by the viewer).

> **Warning:** This endpoint currently returns HTTP 501 Unimplemented. It is documented here for future use but is not yet available.

```
POST /api.document.v1alpha.ContentService/GetQuartzBundle
Content-Type: application/json
```

```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_version_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document_id` | string (UUID) | Yes | Document ID |
| `document_version_id` | string (UUID) | Yes | Document version ID |

**Response:**

```json
{
  "bundle": {
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "documentVersionId": "660e8400-e29b-41d4-a716-446655440001",
    "pages": [
      {
        "pageNumber": 1,
        "contentUrl": "https://storage.factify.com/bundles/...",
        "width": 612,
        "height": 792
      }
    ],
    "totalPages": 12
  }
}
```

---

## Identity & User Management

All endpoints below use ConnectRPC (`POST` with `Content-Type: application/json`).

### Get Caller Details (v1alpha)

Returns the authenticated user's profile including organizations they belong to.

```
POST /api.identity.v1alpha.IdentityService/GetCallerDetails
Content-Type: application/json
```

```json
{}
```

**Response:**

```json
{
  "userAccountDetails": {
    "userAccount": {
      "id": "0197c0ef-26cc-7dc2-9033-68b53d42749d",
      "userId": "0197c0ef-26cc-7e39-9490-e17ed2c1e349",
      "email": "user@example.com",
      "authProvider": "auth0",
      "authSub": "user@example.com"
    },
    "user": {
      "id": "0197c0ef-26cc-7e39-9490-e17ed2c1e349",
      "displayName": "user@example.com"
    },
    "organizations": [
      {
        "id": "01934dbd-5172-7b92-92af-7996d02e5153",
        "name": "Acme",
        "displayName": "Acme"
      }
    ]
  }
}
```

| Field | Description |
|-------|-------------|
| `userAccountDetails.userAccount.id` | Unique account ID (UUID) |
| `userAccountDetails.userAccount.userId` | User profile ID (UUID) |
| `userAccountDetails.userAccount.email` | User email |
| `userAccountDetails.userAccount.authProvider` | Authentication provider (e.g. `auth0`, `google`) |
| `userAccountDetails.userAccount.authSub` | Auth provider subject identifier |
| `userAccountDetails.user.id` | User profile ID (UUID, same as `userAccount.userId`) |
| `userAccountDetails.user.displayName` | User display name |
| `userAccountDetails.organizations[].id` | Organization ID (UUID) |
| `userAccountDetails.organizations[].name` | Organization slug |
| `userAccountDetails.organizations[].displayName` | Organization display name |

### Create Organization (v1alpha)

```
POST /api.identity.v1alpha.IdentityService/CreateOrganization
Content-Type: application/json
```

```json
{
  "name": "new-org",
  "display_name": "New Organization",
  "root_user_account_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a553"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Organization slug (lowercase, no spaces) |
| `display_name` | string | Yes | Human readable display name |
| `root_user_account_id` | string | Yes | Account ID of the root/owner user |

**Response:**

```json
{
  "organization": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a554",
    "name": "New Organization",
    "domain": "neworg.com",
    "createdAt": "2025-02-09T12:00:00Z"
  }
}
```

### Update Organization (v1alpha)

```
POST /api.identity.v1alpha.IdentityService/UpdateOrganization
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "name": "Updated Org Name",
  "settings": {
    "default_document_role": "DOCUMENT_ROLE_VIEWER",
    "allow_public_sharing": true
  }
}
```

**Response:** returns the updated `organization` object.

### Get Organization (v1alpha)

```
POST /api.identity.v1alpha.IdentityService/GetOrganization
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

**Response:** returns an `organization` object.

> **Permissions:** Requires elevated permissions. Standard user tokens receive 403 Forbidden.

### List Organizations (v1alpha)

Lists all organizations the caller belongs to.

```
POST /api.identity.v1alpha.IdentityService/ListOrganizations
Content-Type: application/json
```

```json
{}
```

**Response:**

```json
{
  "organizations": [
    {
      "id": "01934dbd-5172-7b92-92af-7996d02e5153",
      "name": "acme",
      "displayName": "Acme Corp"
    }
  ]
}
```

### Create User (v1alpha)

Creates a new user account within an organization.

```
POST /api.identity.v1alpha.IdentityService/CreateUser
Content-Type: application/json
```

```json
{
  "email": "newuser@acme.com",
  "display_name": "Bob Builder",
  "auth_provider": "google",
  "auth_sub": "google-oauth2|123456"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email |
| `display_name` | string | Yes | Display name |
| `auth_provider` | string | Yes | Authentication provider (e.g. `google`, `auth0`) |
| `auth_sub` | string | Yes | Auth provider subject identifier |

**Response:**

```json
{
  "user": {
    "id": "019346c5-0cf2-7817-d18e-44eda2836099",
    "email": "newuser@acme.com",
    "firstName": "Bob",
    "lastName": "Builder",
    "createdAt": "2025-02-09T12:00:00Z"
  },
  "account": {
    "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a555",
    "organizationId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
    "role": "member"
  }
}
```

### Update User (v1alpha)

```
POST /api.identity.v1alpha.IdentityService/UpdateUser
Content-Type: application/json
```

```json
{
  "user_account_id": "019346c5-0cf2-7817-d18e-44eda2836099",
  "display_name": "Robert Builder",
  "avatar_url": "https://..."
}
```

**Response:** returns the updated `user` object.

### Get User (v1alpha)

```
POST /api.identity.v1alpha.IdentityService/GetUser
Content-Type: application/json
```

```json
{
  "user_account_id": "019346c5-0cf2-7817-d18e-44eda2836099"
}
```

**Response:** returns a `user` object.

### List Organization Users (v1alpha)

Lists all users in an organization.

```
POST /api.identity.v1alpha.IdentityService/ListOrganizationUsers
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "page_size": 50,
  "page_token": ""
}
```

**Response:**

```json
{
  "users": [
    {
      "id": "019346c5-0cf2-7817-d18e-44eda2836070",
      "email": "admin@acme.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "admin"
    }
  ],
  "nextPageToken": ""
}
```

### List User Accounts (v1alpha)

Lists all organization accounts for a user.

```
POST /api.identity.v1alpha.IdentityService/ListUserAccounts
Content-Type: application/json
```

```json
{
  "user_id": "019346c5-0cf2-7817-d18e-44eda2836070"
}
```

**Response:**

```json
{
  "accounts": [
    {
      "id": "019c42ce-f2c7-74aa-8f41-c5aabe92a553",
      "organizationId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
      "organizationName": "Acme Corp",
      "role": "admin",
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ]
}
```

> **Known issue:** This endpoint currently returns 500 Internal Error and may not be operational.

---

## Notifications

> **Note:** The Notification endpoints (`ListNotifications`, `CheckForUpdates`) are **not currently available** on the API. They may be added in a future release. The endpoint paths `NotificationService/ListNotifications` and `NotificationService/CheckForUpdates` return 404.

---

## Actions / Event Tracking

### Report Action (v1alpha)

Reports a client side action/event for analytics and audit purposes.

```
POST /api.document.v1alpha.ActionService/ReportAction
Content-Type: application/json
```

```json
{
  "action": {
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "action_type": 8,
    "timestamp": "2025-02-09T12:00:00Z",
    "payload": "{\"page_number\":\"1\",\"referrer\":\"https://google.com\"}"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | object | Yes | Single action to report |
| `action.document_id` | string (UUID) | Yes | Associated document |
| `action.action_type` | integer | Yes | Action type as a numeric value (not a string enum) |
| `action.timestamp` | string (ISO 8601) | No | When the action occurred |
| `action.payload` | string | Yes | JSON encoded string of additional data. Despite appearing optional, this field is required. |

Action types are numeric values. Known string labels include: `CLIENT_ACTION_TYPE_DOCUMENT_VIEWED`, `CLIENT_ACTION_TYPE_DOCUMENT_DOWNLOADED`, `CLIENT_ACTION_TYPE_LINK_CLICKED`, `CLIENT_ACTION_TYPE_FORM_SUBMITTED`, `CLIENT_ACTION_TYPE_VIDEO_PLAYED`, `CLIENT_ACTION_TYPE_CTA_CLICKED`.

**Response:**

```json
{
  "actionId": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

---

## Cover Pages

### Set Organization Template (v1alpha)

Sets (or updates) the default cover page template for an organization.

```
POST /api.dal.v1alpha.CoverPageService/SetOrganizationTemplate
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552",
  "template": {
    "logo_url": "https://storage.factify.com/logos/acme.png",
    "background_color": "#FFFFFF",
    "accent_color": "#444AFF",
    "font_family": "Inter",
    "show_document_name": true,
    "show_date": true,
    "show_author": true
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | string (UUID) | Yes | Organization ID |
| `name` | string | Yes | Template name (min 1 character) |
| `organization_logo_url` | string (URI) | Yes | Valid URI for the organization logo |
| `template` | object | Yes | Template configuration |
| `template.logo_url` | string | No | URL for logo image |
| `template.background_color` | string | No | Hex background color |
| `template.accent_color` | string | No | Hex accent color |
| `template.font_family` | string | No | Font family name |
| `template.show_document_name` | boolean | No | Show doc name on cover |
| `template.show_date` | boolean | No | Show date on cover |
| `template.show_author` | boolean | No | Show author on cover |

**Response:** empty object `{}` on success.

### Get Organization Template (v1alpha)

Returns the current cover page template for an organization.

```
POST /api.dal.v1alpha.CoverPageService/GetOrganizationTemplate
Content-Type: application/json
```

```json
{
  "organization_id": "019c42ce-f2c7-74aa-8f41-c5aabe92a552"
}
```

**Response:**

```json
{
  "template": {
    "logoUrl": "https://storage.factify.com/logos/acme.png",
    "backgroundColor": "#FFFFFF",
    "accentColor": "#444AFF",
    "fontFamily": "Inter",
    "showDocumentName": true,
    "showDate": true,
    "showAuthor": true
  }
}
```

---

## DAL Services (Legacy)

The following services are deprecated but are still used by the current frontend. They follow the same ConnectRPC convention.

### UserService (deprecated)

```
POST /api.dal.v1alpha.UserService/GetCurrentUser
POST /api.dal.v1alpha.UserService/ListUsers
POST /api.dal.v1alpha.UserService/GetUser
```

### OrganizationService (deprecated)

```
POST /api.dal.v1alpha.OrganizationService/ListOrganizationMembers
```

### DocumentService (deprecated)

> **Note:** While the proto marks the entire service as deprecated, several endpoints are **actively used by the frontend** and are fully functional. The key endpoints for document CRUD are documented in the [Documents](#documents) section above.

| Endpoint | Status | Notes |
|----------|--------|-------|
| `CreateDocument` | **Unimplemented** | Returns 501. Use `CreateLargeDocument` or `api.document.v1alpha.DocumentService/CreateDocument` instead. |
| `ListDocuments` | **Working** | Documented above in "List Documents (DAL v1alpha)" |
| `GetDocument` | **Working** | Documented above in "Get a Document (DAL v1alpha)" |
| `UpdateDocument` | **Working** | Documented above in "Update a Document (DAL v1alpha)" |
| `PatchDocument` | **Working** | Documented above in "Patch a Document (DAL v1alpha)" |
| `CreateDocumentVersion` | **Unimplemented** | Returns 501. Use `CreateLargeDocumentVersion` instead. |
| `ListDocumentVersions` | **Working** | |
| `GetDocumentVersion` | **Working** | |
| `UpdateDocumentVersion` | **Working** | |
| `CreateLargeDocument` | **Working** | Documented above in "Create a Large Document (DAL v1alpha)". Primary upload path used by frontend. |
| `CreateLargeDocumentVersion` | **Working** | Two step upload for new versions of existing documents. |
| `SetVersionCurrent` | **Working** | Sets a specific version as the current/active version. |
| `DetachVersionToNewDocument` | **Working** | Splits a version into its own new document. |

```
POST /api.dal.v1alpha.DocumentService/ListDocuments
POST /api.dal.v1alpha.DocumentService/GetDocument
POST /api.dal.v1alpha.DocumentService/UpdateDocument
POST /api.dal.v1alpha.DocumentService/PatchDocument
POST /api.dal.v1alpha.DocumentService/ListDocumentVersions
POST /api.dal.v1alpha.DocumentService/GetDocumentVersion
POST /api.dal.v1alpha.DocumentService/UpdateDocumentVersion
POST /api.dal.v1alpha.DocumentService/CreateLargeDocument
POST /api.dal.v1alpha.DocumentService/CreateLargeDocumentVersion
POST /api.dal.v1alpha.DocumentService/SetVersionCurrent
POST /api.dal.v1alpha.DocumentService/DetachVersionToNewDocument
```

### SharingService (deprecated)

```
POST /api.dal.v1alpha.SharingService/GrantDocumentAccess
POST /api.dal.v1alpha.SharingService/RevokeDocumentAccess
POST /api.dal.v1alpha.SharingService/ListDocumentAccess
POST /api.dal.v1alpha.SharingService/GrantDocumentVersionAccess
POST /api.dal.v1alpha.SharingService/RevokeDocumentVersionAccess
POST /api.dal.v1alpha.SharingService/ListDocumentVersionAccess
POST /api.dal.v1alpha.SharingService/GetDocumentGeneralAccess
POST /api.dal.v1alpha.SharingService/SetDocumentGeneralAccess
POST /api.dal.v1alpha.SharingService/GetDocumentVersionGeneralAccess
POST /api.dal.v1alpha.SharingService/SetDocumentVersionGeneralAccess
POST /api.dal.v1alpha.SharingService/SharePublicDocument
```

### AnalyticsService (deprecated, not available)

> **Note:** The `AnalyticsService/GetEvents` endpoint no longer exists on the server (returns 404). Use the `DocumentMetricsService` endpoints instead.

---

## Workflow: Lead Generation Gated Document (End to End)

This section walks through the complete flow of creating a document with a lead generation wall, from initial setup to retrieving leads.

### Step 1: Upload a Document

Use one of the following approaches to create a document:

**Option A: v1beta REST (multipart/form-data)**
```
POST /v1beta/documents
Content-Type: multipart/form-data
```

**Option B: v1alpha ConnectRPC (two step upload, recommended)**
```
POST /api.document.v1alpha.DocumentService/CreateDocument
Content-Type: application/json
```
Then upload the file to the presigned URL from the response (see "Create a Document (v1alpha)" in the Documents section).

You receive a `document_id` (UUID) in the response. If using v1beta, the ID will be prefixed (`doc_...`).

### Step 2: Create a Form

Create a contact form under your organization. This defines what information you collect from viewers:

```
POST /api.document.v1alpha.FormService/CreateForm
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Lead Capture Form",
  "description": "Please provide your details to view this document",
  "payload_type": "PAYLOAD_TYPE_CONTACT_FORM",
  "requires_email_otp": true,
  "requires_per_document_submission": false
}
```

Save the returned `form.id` (e.g. `"660e8400-e29b-41d4-a716-446655440001"`).

### Step 3: Create a Policy

Create a lead generation wall policy that references the form:

```
POST /api.document.v1alpha.DocumentAccessService/CreatePolicy
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Gated Content Policy",
  "description": "Require contact form before document access",
  "lead_generation_wall": {
    "content_constraint": {
      "page_range": {
        "start_page": 0,
        "end_page": 2
      }
    },
    "form_id": "660e8400-e29b-41d4-a716-446655440001",
    "excluded_emails_domains": ["@yourcompany.com"],
    "blocked_emails_domains": ["@competitor.com"]
  }
}
```

Here, `page_range` `0` to `2` means pages 0, 1, and 2 are visible as a preview without submitting the form. All other pages are locked behind the wall.

Save the returned `policy.id` (e.g. `"770e8400-e29b-41d4-a716-446655440002"`).

### Step 4: Attach the Policy to a Document

```
POST /api.document.v1alpha.DocumentAccessService/AttachAccessPolicy
Content-Type: application/json
```

```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "policy_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

The document is now gated. Viewers will see the lead generation wall.

### Step 5: Share the Document

Direct viewers to the Factify hosted viewer:

```
https://d.factify.com/documents/01984b45-a787-702e-bd88-e9c91e14b04e
```

Or create a share link for tracking:

```
POST /api.document.v1alpha.ShareLinkService/CreateShareLink
```

### Step 6: Viewer Submits the Form

When a viewer opens the document, they see the unlocked preview pages and a form. After filling it out, the client calls:

```
POST /api.document.v1alpha.FormService/SubmitForm
Content-Type: application/json
```

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e",
  "payload": {
    "contact_form": {
      "full_name": "Jane Smith",
      "email_address": "jane@prospect.com",
      "company_name": "Prospect Corp",
      "company_role": "VP of Engineering"
    }
  }
}
```

If OTP is required, the viewer receives a code by email and re submits with the `otp` field.

### Step 7: Retrieve Leads

Fetch all form submissions to see who accessed the document:

```
POST /api.document.v1alpha.FormService/GetFormSubmissions
Content-Type: application/json
```

```json
{
  "form_id": "660e8400-e29b-41d4-a716-446655440001",
  "document_id": "01984b45-a787-702e-bd88-e9c91e14b04e"
}
```

This returns all contact form submissions for that form and document combination, giving you the lead data.

### Optional: Check Document Analytics

Use the metrics endpoints to see who viewed, how long they spent, and which pages they viewed:

```
POST /api.document.v1alpha.DocumentMetricsService/GetDocumentMetrics
```

---

---

## Common Pitfalls & Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| **CORS Error** (Failed to fetch) | Calling API directly from browser | Use a backend proxy (see "Browser and Frontend Considerations"). |
| **401 Unauthenticated** | Token has double `Bearer` prefix | Strip `Bearer ` from user input before sending (see "Sign In Flow"). |
| **400 Bad Request** (Invalid ID) | Using v1alpha UUID in v1beta endpoint | v1beta requires prefixed IDs (e.g. `doc_...`). Use the correct endpoint for your ID type. |
| **403 Forbidden** (REST) | Token missing permissions for REST | Try the equivalent ConnectRPC endpoint (`https://rpc.factify.com/...`). |

---

# Part 2: Design System

## Brand Colors

### Primary (Brand)

| Token | Hex | Usage |
|-------|-----|-------|
| Brand 100 | `#ecf0ff` | Lightest brand tint, subtle backgrounds |
| Brand 200 | `#c2ceff` | Light brand accent |
| Brand 300 | `#98a9ff` | Hover states for brand elements |
| Brand 400 | `#6e84ff` | Secondary brand accent |
| **Brand 500** | **`#444aff`** | **Primary brand color. Use for primary buttons, links, key interactive elements.** |
| Brand 600 | `#3039dd` | Pressed/active state |
| Brand 700 | `#2025bb` | Darker brand accent |
| Brand 800 | `#171b8d` | Deep brand accent |
| Brand 900 | `#18193d` | Darkest brand accent |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| Neutral 000 | `#ffffff` | White / background |
| Neutral 100 | `#f9fafc` | Subtle background |
| Neutral 200 | `#f2f5fa` | Card background, alternating rows |
| Neutral 300 | `#e6eaf2` | Borders, dividers |
| Neutral 400 | `#dadfeb` | Disabled borders |
| Neutral 500 | `#c4cbdc` | Placeholder text |
| Neutral 600 | `#878ba4` | Subtle/secondary text |
| Neutral 700 | `#70738a` | Muted text |
| Neutral 800 | `#545666` | Body text |
| Neutral 900 | `#34353d` | Strong text |
| Neutral 950 | `#111214` | Headings / highest contrast text |

### Status Colors

| Status | Light (100) | Medium (500) | Dark (700) | Use case |
|--------|-------------|-------------|------------|----------|
| Red | `#ffeaea` | `#f6554f` | `#bd130e` | Errors, danger, destructive |
| Orange | `#fff6eb` | `#ffa537` | `#ad6610` | Warnings, attention needed |
| Green | `#f4fff4` | `#5ad45a` | `#228322` | Success, confirmed, active |
| Blue | `#edf4ff` | `#4a92ff` | `#2567c9` | Info, links, highlights |

## Typography

| Role | Font Family | Usage |
|------|-------------|-------|
| Headlines | **Satoshi Variable** | All headings (H1 through H6) and subheadings |
| Body | **Inter** | Body text, captions, labels, buttons, inputs |

### Type Scale

| Style | Font | Weight | Size | Line Height | Use case |
|-------|------|--------|------|-------------|----------|
| Headline H1 | Satoshi Variable | 700 | 96px | ~115% | Hero / splash screens |
| Headline H2 | Satoshi Variable | 700 | 68px | ~115% | Page titles |
| Headline H3 | Satoshi Variable | 700 | 54px | ~120% | Section titles |
| Headline H4 | Satoshi Variable | 700 | 40px | ~120% | Card headers |
| Headline H5 | Satoshi Variable | 700 | 28px | ~130% | Subsection titles |
| Headline H6 | Satoshi Variable | 700 | 23px | ~130% | Small section titles |
| Subhead 1 | Satoshi Variable | 700 | 20px | ~140% | Large subheading |
| Subhead 2 | Satoshi Variable | 700 | 18px | ~140% | Small subheading |
| Body Regular 1 | Inter | 400 | 18px | ~155% | Large body text |
| Body Regular 2 | Inter | 400 | 16px | ~150% | Default body text |
| Body Regular 3 | Inter | 400 | 14px | ~145% | Small body text, descriptions |
| Body Bold 1 | Inter | 600 | 18px | ~155% | Emphasized large text |
| Body Bold 2 | Inter | 600 | 16px | ~150% | Emphasized default text |
| Body Bold 3 | Inter | 600 | 14px | ~145% | Labels, button text |
| Body Extra Bold 1 | Inter | 800 | 18px | ~155% | Strong emphasis |
| Body Extra Bold 2 | Inter | 800 | 16px | ~150% | Strong emphasis |
| Body Extra Bold 3 | Inter | 800 | 14px | ~145% | Strong emphasis small |
| Caption | Inter | 400 | 12px | ~130% | Metadata, timestamps |
| Caption Bold | Inter | 600 | 12px | ~130% | Bold metadata |
| Overline | Inter | 400 | 11px | ~130% | Label overlines |
| Tiny | Inter | 400 | 10px | ~130% | Legal text, fine print |

## Spacing Scale

4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| 0x | 0px | No spacing |
| 0.25x | 1px | Hairline borders |
| 0.5x | 2px | Tight spacing |
| 1x | 4px | Minimal padding, icon gaps |
| 2x | 8px | Tight padding, small gaps |
| 3x | 12px | Default small padding |
| 4x | 16px | Default padding, standard gaps |
| 5x | 20px | Medium padding |
| 6x | 24px | Large padding |
| 8x | 32px | Section spacing |
| 10x | 40px | Large section spacing |
| 12x | 48px | Extra large spacing |
| 16x | 64px | Major section divisions |
| 20x | 80px | Page level spacing |

## Shadows and Elevation

| Level | Usage |
|-------|-------|
| Elevation Tight | Cards, subtle raised elements |
| Elevation Fluffy | Floating cards, popovers |
| Elevation Overlay | Modals, dialogs, drawers |

Shadow colors use the neutral palette with opacity (e.g., `rgba(84, 86, 102, 0.1)`).

## Border Radii

| Usage | Value |
|-------|-------|
| Extra small (XSM) | 4px |
| Default (CTA) | 8px |
| Popup/Overlay | 12px |
| Large | 16px |
| Full/Circular | 50% |

## Responsive Breakpoints

| Name | Min Width |
|------|-----------|
| xs | 0px |
| sm | 576px |
| md | 768px |
| lg | 992px |
| xl | 1200px |
| xxl | 1440px |

## Component Library

> **Note for Hackathon Participants:** The components below are framework-agnostic specifications. You can implement these styles using any CSS framework (Tailwind, plain CSS, etc.) to match the Factify look and feel.

### Group 1: Core Inputs & Actions

#### 1. Buttons
**Sizes:**
- **xsm**: Height 24px, Padding 0 4px, Radius 4px, Font 14px (Body 3)
- **sm**: Height 32px, Padding 0 8px, Radius 8px, Font 16px (Body 2)
- **md** (Default): Height 40px, Padding 0 12px, Radius 8px, Font 16px (Body Bold 2)
- **lg**: Height 48px, Padding 0 16px, Radius 8px, Font 18px (Body Bold 1)

**Variants:**
- **Primary (Bold + Strong)**: Bg `#444aff` (Brand 500), Text `#ffffff`. Hover Bg `#3039dd`. Pressed Bg `#171b8d`.
- **Destructive (Bold + Danger)**: Bg `#bd130e` (Red 700), Text `#ffffff`. Hover Bg `#a7165c`.
- **Secondary (Outlined + Strong)**: Bg `#ffffff`, Border 1px solid `#e6eaf2` (Neutral 300), Text `#111214`. Hover Border `#c4cbdc`.
- **Tertiary (Minimal + Strong)**: Bg `transparent`, Text `#111214`. Hover Bg `#f9fafc`.

**States:**
- **Disabled**: Opacity 0.7, Bg `#dadfeb` (Neutral 400), Text `#c4cbdc`, Cursor `not-allowed`.
- **Focus Visible**: Ring 3px solid `#98a9ff` (Brand 300).
- **Transition**: `background-color 0.2s, box-shadow 0.2s, opacity 0.2s`.

#### 2. Text Inputs & Textarea
**Sizes:** Matches Button heights (`xsm`: 24px, `sm`: 32px, `md`: 40px).

**Styles:**
- **Default**: Bg `#ffffff`, Border 1px solid `#e6eaf2` (Neutral 300), Radius 8px (4px for xsm), Text `#111214`.
- **Placeholder**: Text `#c4cbdc` (Neutral 500).

**States:**
- **Hover**: Border `#c4cbdc` (Neutral 500).
- **Focus**: Border `#98a9ff` (Brand 300), Outline none.
- **Error**: Border `#bd130e` (Red 700).
- **Success**: Border `#228322` (Green 700).
- **Disabled**: Bg `#dadfeb`, Border `#dadfeb`, Text `#c4cbdc`.

#### 3. Selection Controls
**Checkbox:**
- Size: 16x16px (md) or 14x14px (sm).
- **Unchecked**: Border 2px solid `#e6eaf2`, Bg `#f9fafc`, Radius 4px.
- **Checked**: Bg `#444aff` (Brand 500), Border `#444aff`, White check icon.

**Radio Button:**
- Size: 16x16px. Circle (Radius 50%).
- **Unchecked**: Border 2px solid `#e6eaf2`, Bg `#f9fafc`.
- **Checked**: Border 5px solid `#444aff`, Bg `#ffffff` (creates the dot effect).

**Switch (Toggle):**
- Size: 40x24px (md) or 28x16px (sm). Radius 100px.
- **Off**: Bg `#878ba4` (Neutral 600).
- **On**: Bg `#444aff` (Brand 500).
- **Thumb**: White circle, 2px padding from edge.

#### 4. Dropdowns (Select)
- **Trigger**: Same styling as `Input`.
- **Menu**: Bg `#ffffff`, Shadow `0 4px 16px rgba(17, 18, 20, 0.1)` (Elevation Fluffy), Radius 8px.
- **Item**: Height 32px, Padding 0 8px, Hover Bg `#f2f5fa` (Neutral 200).

### Group 2: Feedback & Status

#### 5. Toast & Semantic Messages
**Toast Container**: Max-width 460px, Fixed bottom-right.

**Styles:**
- **Subtle (Default)**: Bg Semantic-Tint (e.g. `#edf4ff` for Info), Radius 8px, Padding 12px.
- **Bold**: Bg Semantic-Solid (e.g. `#4a92ff` for Info), Text White, Radius 0.

**Colors:**
- **Info**: Blue (`#4a92ff` / `#edf4ff`).
- **Success**: Green (`#5ad45a` / `#f4fff4`).
- **Warning**: Orange (`#ffa537` / `#fff6eb`).
- **Danger**: Red (`#f6554f` / `#ffeaea`).

#### 6. Badges & Tags
**Tag:**
- Bg Semantic-Subtle (e.g., `#f2f5fa` for Natural), Text Default.
- Height 24px (md) or 20px (sm). Radius 4px. Padding 0 8px.

**Chip (Interactive Tag):**
- Similar to Tag but with Hover state (Bg darken) and optional Close icon.
- **Action Chip**: Dashed border `#e6eaf2`.

**Notification Badge:**
- Height 16px, Min-width 16px. Radius 8px.
- Bg `#f6554f` (Red 500), Text White, Font 10px.

#### 7. Loading States
**Spinner:**
- SVG with Conic Gradient (`transparent` to `#444aff`). Animation `spin 1s linear infinite`.

**Skeleton:**
- Bg `#e6eaf2`, Animation `pulse` (opacity 0.5 <-> 1). Radius 4px.

### Group 3: Containers & Overlays

#### 8. Modal & Dialog
- **Overlay**: Bg `rgba(84, 86, 102, 0.5)` (Neutral 800 @ 50%).
- **Dialog**: Bg `#ffffff`, Radius 16px, Shadow `0 0 0 1px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.1)`.
- **Mobile**: Full screen, Radius 0.

#### 9. Tooltip
- Bg `#ffffff`, Text `#111214`, Radius 8px, Shadow Elevation Overlay.
- Padding 4px 8px. Font 12px.

#### 10. Glass Container
- Bg `rgba(255, 255, 255, 0.5)`.
- Backdrop Filter: `blur(8px)` (md) or `blur(4px)` (sm).
- Border: Optional 1px solid `rgba(255, 255, 255, 0.2)`.

### Group 4: Data Display

#### 11. Avatar
- **Shape**: Circle (Radius 50%).
- **Sizes**: Min 16px.
- **Fallback**: Bg `#d04aff` (Purple 500), White text (Initials).
