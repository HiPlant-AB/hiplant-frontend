import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { apiTokenRequest, loginRequest } from "./msalConfig";
import { isMockAuthEnabled, mockUser } from "./mockAuth";

export type AuthAccount = {
  name?: string;
  username?: string;
  tenantId?: string;
  localAccountId?: string;
  roles?: string[];
};

export type UseAuthResult = {
  isAuthenticated: boolean;
  account: AuthAccount | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string>;
};

export function useAuth(): UseAuthResult {
  const { instance, accounts } = useMsal();

  if (isMockAuthEnabled()) {
    return {
      isAuthenticated: true,
      account: mockUser,
      signIn: async () => {
        console.warn("Mock auth is enabled. signIn() does nothing.");
      },
      signOut: async () => {
        console.warn("Mock auth is enabled. signOut() does nothing.");
      },
      getAccessToken: async () => {
        console.warn("Mock auth is enabled. Returning mock access token.");
        return "mock-access-token";
      },
    };
  }

  const account = instance.getActiveAccount() ?? accounts[0] ?? null;

  return {
    isAuthenticated: Boolean(account),
    account,
    signIn: async () => {
      await instance.loginRedirect(loginRequest);
    },
    signOut: async () => {
      if (!account) {
        return;
      }

      await instance.logoutRedirect({
        account,
      });
    },
    getAccessToken: async () => {
      if (!account) {
        throw new Error("Cannot acquire access token because no account is signed in.");
      }

      if (apiTokenRequest.scopes.length === 0) {
        throw new Error("Cannot acquire access token because no API scope is configured.");
      }

      try {
        const result = await instance.acquireTokenSilent({
          ...apiTokenRequest,
          account,
        });

        return result.accessToken;
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          await instance.acquireTokenRedirect({
            ...apiTokenRequest,
            account,
          });

          throw new Error("Redirecting to acquire access token.");
        }

        throw error;
      }
    },
  };
}