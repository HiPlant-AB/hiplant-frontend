
# React + TypeScript + Vite

  

# HiPlant Frontend
HiPlant frontend is a React + TypeScript + Vite application.

The frontend currently supports: 
- Local mock authentication
- Optional Microsoft Entra/MSAL configuration
- Mocked `/api/me` response for frontend-only development
- Real `/api/me` calls to the local HiPlant BFF
- Onboarding-aware routing
- Onboarding form that can call the BFF

  

## Prerequisites
You need:
- Node.js
- npm
- Git

Recommended:
- VS Code
- A modern browser such as Chrome or Edge

  

## Getting started
Clone the repository:

```bash
git  clone  git@github.com:<your-org-or-user>/hiplant-frontend.git
cd  hiplant-frontend
```
Install dependencies
```bash 
npm  install 
```
Create your own copy of .env and populate it
```bash 
cp  .env.example  .env.local
```
Start the frontend:
```bash 
npm run dev
```
Open:
http://localhost:5173

## Local frontend-only mode

Use this mode if you only want to work on the React frontend and do not want to run the BFF.

In .env.local, use:

**Env**
`VITE_AUTH_MODE=mock VITE_USE_MOCK_ME=true   VITE_ENTRA_CLIENT_ID= VITE_ENTRA_TENANT_ID= VITE_ENTRA_REDIRECT_URI=http://localhost:5173 VITE_API_SCOPE=`

This means:
-   Authentication is mocked.
-   The current application user is mocked in the frontend.
-   No backend is required.
    
The app will behave as if a local user is signed in.

## Local frontend + BFF mode

Use this mode if you want the frontend to call the local BFF.

First, start the BFF on port 8080.

Then in .env.local, use:
**Env**
`VITE_AUTH_MODE=mock VITE_USE_MOCK_ME=false   VITE_ENTRA_CLIENT_ID= VITE_ENTRA_TENANT_ID= VITE_ENTRA_REDIRECT_URI=http://localhost:5173 VITE_API_SCOPE=`

Start the frontend:
```Bash
npm run dev
```

Open:
http://localhost:5173

The frontend will call:
/api/me
/api/onboarding/complete
through the Vite proxy.

The proxy forwards API requests to:
http://localhost:8080

## Environment variables

### VITE_AUTH_MODE
Controls authentication mode.

Allowed values:
**Env**
`VITE_AUTH_MODE=mock VITE_AUTH_MODE=entra`

Current recommended local value:
**Env**
`VITE_AUTH_MODE=mock`

### VITE_USE_MOCK_ME

Controls whether /api/me is mocked in the frontend or fetched from the BFF.

For frontend-only development:
**Env**
`VITE_USE_MOCK_ME=true`

For local BFF integration:
**Env**
`VITE_USE_MOCK_ME=false`

Important: if you change .env.local, restart the Vite dev server.

```Bash
Ctrl+C npm run dev
```
### VITE_ENTRA_CLIENT_ID

Microsoft Entra SPA application client ID.
Currently optional because local development uses mock auth.

### VITE_ENTRA_TENANT_ID

Microsoft Entra tenant ID.
Currently optional because local development uses mock auth.

### VITE_ENTRA_REDIRECT_URI

Redirect URI for local Microsoft Entra authentication.

Default:
**Env**
`VITE_ENTRA_REDIRECT_URI=http://localhost:5173`

### VITE_API_SCOPE

API scope used when requesting an access token for the BFF.

Currently optional until the backend API app registration exists.

Example future value:
**Env**
`VITE_API_SCOPE=api://<backend-api-client-id>/access_as_user`

## Current local user

When using mock auth, the app signs in as a local mock user.

The mock user is defined in:
src/auth/mockAuth.ts

## Current application user

The application user is either:
-   returned by the frontend mock in src/api/mockMeApi.ts
-   returned by the BFF from GET /api/me
 
The application user controls onboarding status.

Possible onboarding statuses:
not_started
profile_required
approval_required
completed

## Onboarding flow
If the current application user has:
onboardingStatus: profile_required
the frontend redirects the user to:
/onboarding

The onboarding form calls:
**Http**
`POST /api/onboarding/complete`
When the BFF returns:
onboardingStatus: completed
the frontend redirects the user to:
/

## Vite proxy

The Vite development server proxies /api calls to the BFF.

Config:
vite.config.ts

Current proxy target:
http://localhost:8080

This lets frontend code use relative API paths:
**Ts**
`fetch("/api/me")`
instead of hardcoding backend URLs.