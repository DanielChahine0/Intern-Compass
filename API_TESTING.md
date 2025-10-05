# API Testing Examples

This file contains example API requests you can use to test your backend.

## Using cURL (PowerShell)

### Health Check
```powershell
curl http://localhost:3000/health
```

### API Root
```powershell
curl http://localhost:3000
```

---

## User API Tests

### Create/Update User
```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{
    "auth0_id": "auth0|test123",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }'
```

### Get User by Auth0 ID
```powershell
curl http://localhost:3000/api/users/auth0/auth0|test123
```

### Get User by Email
```powershell
curl http://localhost:3000/api/users/email/test@example.com
```

### Get All Users
```powershell
curl http://localhost:3000/api/users
```

### Update User Role
```powershell
curl -X PATCH http://localhost:3000/api/users/1/role `
  -H "Content-Type: application/json" `
  -d '{"role": "admin"}'
```

---

## Document API Tests

### Create Document
```powershell
curl -X POST http://localhost:3000/api/documents `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Employee Handbook 2024",
    "content": "This is the complete employee handbook covering all policies and procedures.",
    "tags": ["onboarding", "policy", "hr"],
    "access_scope": "all",
    "uploaded_by": 1
  }'
```

### Get All Documents
```powershell
curl http://localhost:3000/api/documents
```

### Get Document by ID
```powershell
curl http://localhost:3000/api/documents/1
```

### Get Documents by Tag
```powershell
curl http://localhost:3000/api/documents/tag/onboarding
```

### Search Documents
```powershell
curl http://localhost:3000/api/documents/search/employee
```

### Update Document Status
```powershell
curl -X PATCH http://localhost:3000/api/documents/1/status `
  -H "Content-Type: application/json" `
  -d '{"status": "processed"}'
```

### Delete Document
```powershell
curl -X DELETE http://localhost:3000/api/documents/1
```

---

## Chat API Tests

### Create User Message
```powershell
curl -X POST http://localhost:3000/api/chat `
  -H "Content-Type: application/json" `
  -d '{
    "user_id": 1,
    "role": "user",
    "content": "What is our tech stack?",
    "filter_category": "tech-stack"
  }'
```

### Create Assistant Message with Citations
```powershell
curl -X POST http://localhost:3000/api/chat `
  -H "Content-Type: application/json" `
  -d '{
    "user_id": 1,
    "role": "assistant",
    "content": "Our tech stack includes React, TypeScript, Node.js, and PostgreSQL.",
    "citations": [
      {
        "doc_title": "Tech Stack Overview",
        "page": 2,
        "snippet": "Frontend: React with TypeScript..."
      }
    ]
  }'
```

### Get Chat History
```powershell
curl http://localhost:3000/api/chat/user/1
```

### Get Chat History with Limit
```powershell
curl "http://localhost:3000/api/chat/user/1?limit=10"
```

### Get Filtered Messages
```powershell
curl http://localhost:3000/api/chat/user/1/filter/tech-stack
```

### Get Message Statistics
```powershell
curl http://localhost:3000/api/chat/user/1/stats
```

### Delete Single Message
```powershell
curl -X DELETE http://localhost:3000/api/chat/1
```

### Delete User Chat History
```powershell
curl -X DELETE http://localhost:3000/api/chat/user/1
```

---

## Complete Workflow Test

### 1. Create a User
```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{
    "auth0_id": "auth0|workflow-test",
    "email": "workflow@test.com",
    "name": "Workflow Test User"
  }'
```

### 2. Upload a Document
```powershell
curl -X POST http://localhost:3000/api/documents `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Getting Started Guide",
    "content": "Welcome to the company! This guide will help you get started.",
    "tags": ["onboarding", "guide"],
    "uploaded_by": 1
  }'
```

### 3. Send a Chat Message
```powershell
curl -X POST http://localhost:3000/api/chat `
  -H "Content-Type: application/json" `
  -d '{
    "user_id": 1,
    "role": "user",
    "content": "How do I get started?"
  }'
```

### 4. Verify Everything
```powershell
# Check users
curl http://localhost:3000/api/users

# Check documents
curl http://localhost:3000/api/documents

# Check chat history
curl http://localhost:3000/api/chat/user/1
```

---

## Using Postman or Insomnia

Import this JSON collection:

```json
{
  "name": "InternCompass API",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:3000/health"
    },
    {
      "name": "Create User",
      "method": "POST",
      "url": "http://localhost:3000/api/users",
      "headers": [
        {"key": "Content-Type", "value": "application/json"}
      ],
      "body": {
        "auth0_id": "auth0|test123",
        "email": "test@example.com",
        "name": "Test User"
      }
    },
    {
      "name": "Get All Documents",
      "method": "GET",
      "url": "http://localhost:3000/api/documents"
    },
    {
      "name": "Create Document",
      "method": "POST",
      "url": "http://localhost:3000/api/documents",
      "headers": [
        {"key": "Content-Type", "value": "application/json"}
      ],
      "body": {
        "title": "Test Document",
        "content": "This is a test document",
        "tags": ["test"]
      }
    },
    {
      "name": "Get Chat History",
      "method": "GET",
      "url": "http://localhost:3000/api/chat/user/1"
    }
  ]
}
```

---

## Testing with JavaScript

```javascript
// Example: Create user and document
async function testAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  // Create user
  const userResponse = await fetch(`${baseURL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth0_id: 'auth0|js-test',
      email: 'jstest@example.com',
      name: 'JS Test User'
    })
  });
  const user = await userResponse.json();
  console.log('User created:', user);
  
  // Create document
  const docResponse = await fetch(`${baseURL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'JS Test Document',
      content: 'Created from JavaScript',
      tags: ['test'],
      uploaded_by: user.id
    })
  });
  const doc = await docResponse.json();
  console.log('Document created:', doc);
  
  // Get all documents
  const docsResponse = await fetch(`${baseURL}/documents`);
  const docs = await docsResponse.json();
  console.log('All documents:', docs);
}

testAPI();
```

---

## Expected Response Formats

### User Object
```json
{
  "id": 1,
  "auth0_id": "auth0|test123",
  "email": "test@example.com",
  "name": "Test User",
  "role": "user",
  "created_at": "2025-10-04T12:00:00.000Z",
  "updated_at": "2025-10-04T12:00:00.000Z"
}
```

### Document Object
```json
{
  "id": 1,
  "title": "Employee Handbook",
  "content": "Full content here...",
  "access_scope": "all",
  "status": "processed",
  "uploaded_by": 1,
  "uploaded_at": "2025-10-04T12:00:00.000Z",
  "updated_at": "2025-10-04T12:00:00.000Z",
  "tags": ["onboarding", "policy"]
}
```

### Chat Message Object
```json
{
  "id": 1,
  "user_id": 1,
  "role": "user",
  "content": "What is our tech stack?",
  "filter_category": "tech-stack",
  "created_at": "2025-10-04T12:00:00.000Z",
  "citations": []
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "message": "title and content are required"
}
```

### 404 Not Found
```json
{
  "error": "User not found",
  "message": "No user found with Auth0 ID: auth0|test123"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create document",
  "message": "Database error details"
}
```
