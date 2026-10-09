import { useCallback, useMemo } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";
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

function mapMsalAccount(account: AccountInfo | null): AuthAccount | null {
  if (!account) {
    return null;
  }

  return {
    name: account.name,
    username: account.username,
    tenantId: account.tenantId,
    localAccountId: account.localAccountId,
  };
}

export function useAuth(): UseAuthResult {
  const { instance, accounts } = useMsal();
  const msalAccount = instance.getActiveAccount() ?? accounts[0] ?? null;
  const account = mapMsalAccount(msalAccount);

  const signIn = useCallback(async () => {
    if (isMockAuthEnabled()) {
      console.warn("Mock auth is enabled. signIn() does nothing.");
      return;
    }

    await instance.loginRedirect(loginRequest);
  }, [instance]);

  const signOut = useCallback(async () => {
    if (isMockAuthEnabled()) {
      console.warn("Mock auth is enabled. signOut() does nothing.");
      return;
    }

    if (!msalAccount) {
      return;
    }

    await instance.logoutRedirect({
      account: msalAccount,
    });
  }, [instance, msalAccount]);

  const getAccessToken = useCallback(async () => {
    if (isMockAuthEnabled()) {
      console.warn("Mock auth is enabled. Returning mock access token.");
      return "mock-access-token";
    }

    if (!msalAccount) {
      throw new Error("Cannot acquire access token because no account is signed in.");
    }

    if (apiTokenRequest.scopes.length === 0) {
      throw new Error("Cannot acquire access token because no API scope is configured.");
    }

    try {
      const result = await instance.acquireTokenSilent({
        ...apiTokenRequest,
        account: msalAccount,
      });

      return result.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect({
          ...apiTokenRequest,
          account: msalAccount,
        });

        throw new Error("Redirecting to acquire access token.");
      }

      throw error;
    }
  }, [instance, msalAccount]);

  return useMemo(() => {
    if (isMockAuthEnabled()) {
      return {
        isAuthenticated: true,
        account: mockUser,
        signIn,
        signOut,
        getAccessToken,
      };
    }

    return {
      isAuthenticated: Boolean(account),
      account,
      signIn,
      signOut,
      getAccessToken,
    };
  }, [account, getAccessToken, signIn, signOut]);
}