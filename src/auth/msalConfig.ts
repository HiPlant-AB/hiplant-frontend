import type {
  Configuration,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID;
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID;
const redirectUri = import.meta.env.VITE_ENTRA_REDIRECT_URI;
const apiScope = import.meta.env.VITE_API_SCOPE;

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: RedirectRequest = {
  scopes: ["openid", "profile", "email"],
};

export const apiTokenRequest: SilentRequest = {
  scopes: apiScope ? [apiScope] : [],
};