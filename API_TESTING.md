# Axigon AI API Testing Guide

Use these curl commands or import into Postman to test your API.

## Base URL
```
Local: http://localhost:3000/api
Production: https://your-app.vercel.app/api
```

## 1. Test Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 3. Test Get Profile (Authenticated)

```bash
# Replace YOUR_TOKEN with the token from login/signup
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 4. Test Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "company": "New Company"
  }'
```

## 5. Test Get All Agents

```bash
curl -X GET http://localhost:3000/api/agents
```

## 6. Test Search Agents

```bash
# Search by term
curl -X GET "http://localhost:3000/api/agents?search=legal"

# Filter by domain
curl -X GET "http://localhost:3000/api/agents?domain=Legal%20Analysis"
```

## 7. Test Create Agent (Authenticated)

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestAgent",
    "domain": "Testing",
    "description": "A test agent for development",
    "features": ["Feature 1", "Feature 2"],
    "pricing": {
      "model": "subscription",
      "price": 299
    },
    "capabilities": ["Capability 1"]
  }'
```

## 8. Test Get Single Agent

```bash
# Replace AGENT_ID with actual ID from previous response
curl -X GET http://localhost:3000/api/agents/AGENT_ID
```

## 9. Test Update Agent (Authenticated)

```bash
curl -X PUT http://localhost:3000/api/agents/AGENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Agent Name",
    "pricing": {
      "model": "enterprise",
      "price": 999
    }
  }'
```

## 10. Test Delete Agent (Authenticated)

```bash
curl -X DELETE http://localhost:3000/api/agents/AGENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Postman Collection

You can also import this collection into Postman:

1. Create a new collection "Axigon API"
2. Add environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (will be set after login)
3. Add the requests above
4. Use `{{base_url}}` and `{{token}}` in your requests

## Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Testing Workflow

1. Signup a new user
2. Copy the token from response
3. Use token for authenticated requests
4. Test profile endpoints
5. Test agent CRUD operations
6. Test search and filtering
