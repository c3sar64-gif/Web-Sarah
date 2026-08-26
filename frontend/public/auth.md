# Auth.md

## Authentication

This document describes how AI agents and automated systems authenticate and interact with the **Sarah — Horneado con Amor** API.

## Agent Registration

AI agents can register to obtain credentials and access tokens for placing orders and querying the pastry catalog.

### Step 1: Register Agent

Send a `POST` request to the registration endpoint:

```http
POST /api/auth/register HTTP/1.1
Host: sarah-horneado-con-amor.com
Content-Type: application/json

{
  "client_name": "AutonomousAgent",
  "grant_types": ["client_credentials", "authorization_code"],
  "response_types": ["token"],
  "scope": "orders:read orders:write products:read"
}
```

Response returns `client_id`, `client_secret`, and assigned scopes.

### Step 2: Obtain Access Token

Exchange credentials for a Bearer token:

```http
POST /api/auth/token HTTP/1.1
Host: sarah-horneado-con-amor.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=orders:read%20orders:write
```

### Step 3: Access Protected APIs

Include the token in the `Authorization` header:

```http
GET /api/ordenes HTTP/1.1
Host: sarah-horneado-con-amor.com
Authorization: Bearer <access_token>
```

## OAuth 2.0 & OIDC Endpoints

- **Issuer / Authorization Server**: `https://sarah-horneado-con-amor.com`
- **Registration URI**: `https://sarah-horneado-con-amor.com/api/auth/register`
- **Token URI**: `https://sarah-horneado-con-amor.com/api/auth/token`
- **Revocation URI**: `https://sarah-horneado-con-amor.com/api/auth/revoke`
- **Protected Resource**: `https://sarah-horneado-con-amor.com/api/`
- **Authorization Server Metadata**: `/.well-known/oauth-authorization-server`
- **Protected Resource Metadata**: `/.well-known/oauth-protected-resource`

## Supported Identity and Credential Types

- **Identity Types**: `agent`, `user`
- **Credential Types**: `client_secret`, `bearer_token`
- **Grant Types**: `client_credentials`, `authorization_code`, `password`

## Scopes

- `orders:read`: Query order state and purchase tickets.
- `orders:write`: Create new bakery orders in Cochabamba and confirm BNB QR payments.
- `products:read`: View artisan cake, pie, cookie, and pastry prices in Bs.

## Additional Documentation
- [LLMs Full Catalog](/llms.txt)
- [Agent Manifest (agent.json)](/.well-known/agent.json)
- [API Catalog RFC 9727](/.well-known/api-catalog)
- [OpenAPI 3.0 Spec](/api/openapi.json)
