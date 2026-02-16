# Factify API Reference (For Future Backend Integration)

The prototype currently uses mock data, but was designed to eventually integrate with the Factify API. This documents the API for reference.

## What is Factify?

Factify is a document infrastructure platform for **safe, controlled document sharing**. Instead of emailing raw PDFs, users upload documents to Factify and share them through secure links with access control.

Key capabilities:
- **Access policies**: Gate access with requirements (e.g., lead generation walls)
- **Role-based permissions**: Viewer, Commenter, Collaborator, Admin, Owner
- **Document analytics**: Track views, time per page, referral sources
- **AI chat**: Built-in AI assistant for document Q&A
- **Clear ownership**: Every document has an owner and audit trail

## Base URLs

| Protocol | Base URL |
|----------|----------|
| v1beta REST | `https://api.factify.com` |
| v1alpha ConnectRPC | `https://rpc.factify.com` |

**Important**: As of 2026-02-10, all v1beta REST endpoints are blocked by Cloudflare challenge pages when called server-side. **Use ConnectRPC v1alpha endpoints exclusively** for all programmatic access.

## Authentication

Every request requires:
```
Authorization: Bearer <token>
```

Users paste their Factify token in the app. Normalize by stripping "Bearer " prefix:
```javascript
const cleanToken = rawToken.replace(/^Bearer\s+/i, "").trim();
```

### Get Current User
```
POST https://rpc.factify.com/api.dal.v1alpha.UserService/GetCurrentUser
Content-Type: application/json
Body: {}
```

Returns: user ID, email, organization info.

## Document Viewing

Documents are viewed on the Factify hosted viewer — **not** embedded:
```
https://d.factify.com/documents/{document_id}
https://d.factify.com/documents/{document_id}/versions/{version_id}
```

Your app manages documents via API and sends users to these URLs.

## Key API Endpoints (ConnectRPC)

All ConnectRPC calls are POST requests to `https://rpc.factify.com/...`.

### Document Management

| Endpoint | Purpose |
|----------|---------|
| `DocumentService/ListDocuments` | List all documents |
| `DocumentService/GetDocument` | Get document details |
| `DocumentService/UploadDocument` | Upload a new PDF |
| `DocumentService/UpdateDocument` | Update document metadata |

### Sharing & Access

| Endpoint | Purpose |
|----------|---------|
| `SharingService/ListDocumentAccess` | List who has access |
| `SharingService/ShareDocument` | Share with a user |
| `SharingService/RevokeAccess` | Remove access |

### Analytics

| Endpoint | Purpose |
|----------|---------|
| `AnalyticsService/GetDocumentAnalytics` | View/engagement data |
| `AnalyticsService/GetPageAnalytics` | Per-page analytics |

### AI Chat

| Endpoint | Purpose |
|----------|---------|
| `ChatService/SendMessage` | Send chat message |
| `ChatService/GetChatHistory` | Get conversation |

## Pagination

ConnectRPC endpoints use:
- `page_size` (1-100, default 50)
- `page_token` (string)
- Response includes `pagination.next_page_token`, `pagination.has_more`

## Integration Notes for Future Development

1. **Replace mock data** with real Factify API calls for documents
2. **CRM integration** would use Salesforce/HubSpot APIs for VIP data
3. **AI recommendations** could use OpenAI or similar for real document-VIP matching
4. **Comments/annotations** would sync through Factify's collaboration features
5. **Analytics** would come from Factify's tracking (time on page, completion, etc.)
6. **AI chat** would use Factify's built-in AI chat endpoint instead of scripted responses
7. **Document upload** would go through Factify's upload API
8. **Sharing** would create real Factify share links with access policies
