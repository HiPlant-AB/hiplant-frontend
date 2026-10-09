import { useCallback, useEffect, useState } from "react";
import { isMockAuthEnabled } from "../auth/mockAuth";
import { useAuth } from "../auth/useAuth";
import { fetchMockCurrentUser } from "./mockMeApi";
import { fetchCurrentUser, type CurrentUser } from "./meApi";

export type CurrentUserState = {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useCurrentUser(): CurrentUserState {
  const { isAuthenticated, getAccessToken } = useAuth();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const useMockMe = import.meta.env.VITE_USE_MOCK_ME !== "false";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isAuthenticated) {
      setCurrentUser(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = useMockMe
        ? await fetchMockCurrentUser()
        : await fetchCurrentUser(await getAccessToken());

      setCurrentUser(user);
    } catch (unknownError) {
      console.error(unknownError);

      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Failed to load current user."
      );

      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, isAuthenticated]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    currentUser,
    isLoading,
    error,
    reload,
  };
}